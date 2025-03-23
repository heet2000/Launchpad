import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const useStorage = () => {
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useAuth();

    const uploadFile = async (file, fileName = file.name) => {
        setLoading(true);
        setError(null);
        setProgress(0);

        try {
            const formData = new FormData();
            formData.append('files', file);

            const response = await axios.post('http://127.0.0.1:5003/upload', formData, {
                headers: {
                    'token': 'abcdef'
                },
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentage);
                }
            });

            if (response.status === 200 || response.status === 201) {
                // Assuming the API returns the file URL in the response
                const downloadURL = response.data.url || response.data.fileUrl || '';
                setUrl(downloadURL);
            } else {
                throw new Error('Upload failed');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Failed to upload file');
        } finally {
            setLoading(false);
        }
    };

    return { progress, url, error, loading, uploadFile };
};

export default useStorage; 