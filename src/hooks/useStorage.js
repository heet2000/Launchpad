import { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const useStorage = () => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const storage = getStorage();
    const firestore = getFirestore();

    const uploadFile = (file, fileName = file.name) => {
        setLoading(true);
        setError(null);
        setProgress(0);

        const extension = file.name.split('.').pop();
        const timestamp = Date.now();
        const storagePath = `uploads/${currentUser.uid}/${timestamp}_${fileName}`;

        const storageRef = ref(storage, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
                // Track upload progress
                const percentage = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(percentage);
            },
            (err) => {
                // Handle error
                setError(err);
                setLoading(false);
            },
            async () => {
                // Upload complete, get URL
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                    // Store file reference in Firestore
                    const docRef = await addDoc(collection(firestore, 'files'), {
                        url: downloadURL,
                        fileName: fileName,
                        originalName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        extension,
                        createdAt: serverTimestamp(),
                        userId: currentUser.uid
                    });

                    setUrl(downloadURL);
                    setLoading(false);
                } catch (err) {
                    setError(err);
                    setLoading(false);
                }
            }
        );
    };

    return { progress, url, error, loading, uploadFile };
};

export default useStorage; 