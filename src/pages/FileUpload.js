import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaFile, FaTrash, FaCheckCircle } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';
import useStorage from '../hooks/useStorage';

const UploadContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const UploadTitle = styled(motion.h2)`
  color: var(--primary-color);
  font-size: 28px;
  margin-bottom: 20px;
  text-align: center;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
`;

const UploadDescription = styled.p`
  color: var(--light-color);
  text-align: center;
  margin-bottom: 30px;
  font-size: 16px;
`;

const DropZone = styled(motion.div)`
  position: relative;
  width: 100%;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  .upload-content {
    background: var(--glass-bg);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 30px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0;
    cursor: pointer;
  }
`;

const UploadIcon = styled.div`
  font-size: 48px;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const FileList = styled(motion.div)`
  margin-top: 30px;
  width: 100%;
`;

const FileItem = styled(motion.div)`
  background: var(--glass-bg);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: var(--light-color);
  border: 1px solid rgba(255, 215, 0, 0.2);

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
  }
`;

const FileName = styled.span`
  flex: 1;
  margin-right: 15px;
  color: var(--primary-color);
`;

const FileSize = styled.span`
  color: var(--accent-color);
  margin-right: 15px;
`;

const RemoveButton = styled.button`
  background: none;
  border: none;
  color: var(--error-color);
  cursor: pointer;
  padding: 5px;
  transition: all 0.3s ease;

  &:hover {
    color: var(--secondary-color);
    transform: scale(1.1);
  }
`;

const ProgressBar = styled(motion.div)`
  width: 100%;
  height: 4px;
  background: rgba(255, 215, 0, 0.1);
  border-radius: 2px;
  margin-top: 5px;
  overflow: hidden;

  div {
    height: 100%;
    background: linear-gradient(90deg, var(--primary-color), var(--accent-color));
    border-radius: 2px;
  }
`;

const SuccessMessage = styled(motion.div)`
  color: var(--success-color);
  background: rgba(255, 215, 0, 0.1);
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 215, 0, 0.2);
`;

const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
};

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const [isDragActive, setIsDragActive] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const fileInputRef = useRef(null);
    const { progress, url, error, loading, uploadFile } = useStorage();

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const newFiles = selectedFiles.map((file) => ({
            file,
            id: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'ready',
        }));

        setFiles([...files, ...newFiles]);
    };

    // Handle drop zone click
    const handleDropzoneClick = () => {
        fileInputRef.current.click();
    };

    // Handle drag events
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        const droppedFiles = Array.from(e.dataTransfer.files);

        const newFiles = droppedFiles.map((file) => ({
            file,
            id: URL.createObjectURL(file),
            name: file.name,
            size: file.size,
            type: file.type,
            progress: 0,
            status: 'ready',
        }));

        setFiles([...files, ...newFiles]);
    };

    // Handle file deletion
    const handleDeleteFile = (id) => {
        setFiles(files.filter((file) => file.id !== id));
    };

    // Handle file upload
    const handleUploadFile = async (fileObj) => {
        try {
            setFiles(files.map((f) =>
                f.id === fileObj.id ? { ...f, status: 'uploading' } : f
            ));

            await uploadFile(fileObj.file);

            setFiles(files.map((f) =>
                f.id === fileObj.id ? { ...f, status: 'uploaded', progress: 100 } : f
            ));

            setSuccessMessage(`${fileObj.name} uploaded successfully!`);

            // Clear success message after 3 seconds
            setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
        } catch (err) {
            console.error('Upload error:', err);

            setFiles(files.map((f) =>
                f.id === fileObj.id ? { ...f, status: 'error' } : f
            ));
        }
    };

    return (
        <DashboardLayout>
            <UploadContainer>
                <UploadTitle
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    Upload Files
                </UploadTitle>

                <UploadDescription>
                    Drag and drop files or click to select files to upload.
                </UploadDescription>

                {successMessage && (
                    <SuccessMessage
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <FaCheckCircle /> {successMessage}
                    </SuccessMessage>
                )}

                <div className="animated-border">
                    <DropZone
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="upload-content">
                            <UploadIcon>
                                <FaCloudUploadAlt />
                            </UploadIcon>
                            <p>Drop your files here or click to browse</p>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                multiple
                                style={{ display: 'none' }}
                            />
                        </div>
                    </DropZone>
                </div>

                {files.length > 0 && (
                    <FileList
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {files.map((file, index) => (
                            <div className="animated-border" key={file.name}>
                                <FileItem>
                                    <FileName>{file.name}</FileName>
                                    <FileSize>{formatFileSize(file.size)}</FileSize>
                                    <RemoveButton onClick={() => handleDeleteFile(file.id)}>
                                        <FaTrash />
                                    </RemoveButton>
                                    {file.status === 'uploading' && (
                                        <ProgressBar>
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                transition={{ duration: 0.3 }}
                                            />
                                        </ProgressBar>
                                    )}
                                </FileItem>
                            </div>
                        ))}
                    </FileList>
                )}
            </UploadContainer>
        </DashboardLayout>
    );
};

export default FileUpload; 