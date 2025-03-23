import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaTrash, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import DashboardLayout from '../components/DashboardLayout';
import axios from 'axios';

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
  text-shadow: 0 0 10px rgba(157, 0, 255, 0.3);
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
  border: 1px solid rgba(157, 0, 255, 0.2);

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 0 15px rgba(157, 0, 255, 0.2);
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

const FileStatus = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 15px;
  
  &.ready {
    background: rgba(157, 0, 255, 0.1);
    color: #9D00FF;
  }
  
  &.uploading {
    background: rgba(255, 193, 7, 0.1);
    color: #FFC107;
  }
  
  &.success {
    background: rgba(0, 255, 0, 0.1);
    color: #00FF00;
  }
  
  &.error {
    background: rgba(255, 0, 0, 0.1);
    color: #FF0000;
  }
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
  background: rgba(157, 0, 255, 0.1);
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
  background: rgba(157, 0, 255, 0.1);
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(157, 0, 255, 0.2);
`;

const ErrorMessage = styled(motion.div)`
  color: var(--error-color);
  background: rgba(255, 0, 0, 0.1);
  padding: 10px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid rgba(255, 0, 0, 0.2);
`;

const UploadButton = styled(motion.button)`
  width: 100%;
  padding: 12px;
  background: linear-gradient(45deg, #9D00FF, #FF69B4);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 20px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(157, 0, 255, 0.5);
  }

  &:disabled {
    background: linear-gradient(135deg, #9e9e9e, #757575);
    cursor: not-allowed;
    box-shadow: none;
  }
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
    const [errorMessage, setErrorMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        const validFiles = selectedFiles.filter(file => {
            const fileType = file.type;
            return fileType === 'application/pdf' || fileType === 'text/plain';
        });

        if (validFiles.length < selectedFiles.length) {
            setErrorMessage('Some files were skipped. Only .txt and .pdf files are allowed.');

            // Clear error message after 5 seconds
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }

        const newFiles = validFiles.map((file) => ({
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

        const validFiles = droppedFiles.filter(file => {
            const fileType = file.type;
            return fileType === 'application/pdf' || fileType === 'text/plain';
        });

        if (validFiles.length < droppedFiles.length) {
            setErrorMessage('Some files were skipped. Only .txt and .pdf files are allowed.');

            // Clear error message after 5 seconds
            setTimeout(() => {
                setErrorMessage('');
            }, 5000);
        }

        const newFiles = validFiles.map((file) => ({
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

    // Upload all files
    const handleUploadAllFiles = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setErrorMessage('');
        setSuccessMessage('');

        try {
            // Update status of all files to uploading
            setFiles(files.map(file => ({
                ...file,
                status: 'uploading',
                progress: 0
            })));

            // Create FormData
            const formData = new FormData();

            // Append all files to formData
            files.forEach(fileObj => {
                formData.append('files', fileObj.file);
            });

            // Upload files using the API
            const response = await axios.post('https://information-retrieval-service.onrender.com/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': 'abcdef'
                },
                withCredentials: false,
                onUploadProgress: (progressEvent) => {
                    const percentage = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    // Update progress for all files
                    setFiles(prevFiles =>
                        prevFiles.map(file => ({
                            ...file,
                            progress: percentage,
                        }))
                    );
                }
            });

            // Handle successful upload
            if (response.status === 200) {
                setFiles(prevFiles =>
                    prevFiles.map(file => ({
                        ...file,
                        progress: 100,
                        status: 'success'
                    }))
                );

                setSuccessMessage(`Successfully uploaded ${files.length} file${files.length > 1 ? 's' : ''}!`);

                // Clear success message after 5 seconds
                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error('Upload error:', error);

            // Mark all files as error
            setFiles(prevFiles =>
                prevFiles.map(file => ({
                    ...file,
                    status: 'error'
                }))
            );

            setErrorMessage(error.response?.data?.message || 'Failed to upload files. Please try again.');
        } finally {
            setUploading(false);
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

                {errorMessage && (
                    <ErrorMessage
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                    >
                        <FaExclamationTriangle /> {errorMessage}
                    </ErrorMessage>
                )}

                <div className="animated-border">
                    <DropZone
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onClick={handleDropzoneClick}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={isDragActive ? 'file-upload-dragover' : ''}
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
                                accept=".txt,.pdf"
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
                            <FileItem key={file.id}>
                                <FileName>{file.name}</FileName>
                                <FileSize>{formatFileSize(file.size)}</FileSize>
                                <FileStatus className={file.status}>
                                    {file.status === 'ready' ? 'Ready' :
                                        file.status === 'uploading' ? 'Uploading...' :
                                            file.status === 'success' ? 'Uploaded' : 'Failed'}
                                </FileStatus>
                                <RemoveButton onClick={() => handleDeleteFile(file.id)}>
                                    <FaTrash />
                                </RemoveButton>
                                {file.status === 'uploading' && (
                                    <ProgressBar>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${file.progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </ProgressBar>
                                )}
                            </FileItem>
                        ))}

                        <UploadButton
                            onClick={handleUploadAllFiles}
                            disabled={uploading || files.length === 0}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {uploading ? 'Uploading...' : 'Upload All Files'}
                        </UploadButton>
                    </FileList>
                )}
            </UploadContainer>
        </DashboardLayout>
    );
};

export default FileUpload; 