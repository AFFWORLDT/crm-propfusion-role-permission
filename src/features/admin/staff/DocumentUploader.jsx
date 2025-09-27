import React, { useState, useRef } from 'react';
import useUploadDocs from './useUploadDocs';

const DocumentUploader = ({ agentId }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const fileInputRef = useRef(null);
    const { addDocs, isPending, error } = useUploadDocs();

    const handleFileSelect = (event) => {
        const files = Array.from(event.target.files);
        
        // Validate file types and sizes
        const validFiles = files.filter(file => {
            const isValidType = file.type.startsWith('image/') || 
                              file.type === 'application/pdf' ||
                              file.type === 'application/msword' ||
                              file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
            return isValidType && isValidSize;
        });

        setSelectedFiles(validFiles);

        // Create preview URLs for images
        const urls = validFiles.map(file => {
            if (file.type.startsWith('image/')) {
                return URL.createObjectURL(file);
            }
            return null;
        });
        setPreviewUrls(urls);
    };

    const handleUpload = () => {
        if (selectedFiles.length > 0) {
            addDocs({ agentId, docs: selectedFiles });
            // Clean up preview URLs
            previewUrls.forEach(url => {
                if (url) URL.revokeObjectURL(url);
            });
            setSelectedFiles([]);
            setPreviewUrls([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const removeFile = (index) => {
        const newFiles = [...selectedFiles];
        newFiles.splice(index, 1);
        setSelectedFiles(newFiles);

        // Clean up preview URL if it exists
        if (previewUrls[index]) {
            URL.revokeObjectURL(previewUrls[index]);
        }
        const newPreviewUrls = [...previewUrls];
        newPreviewUrls.splice(index, 1);
        setPreviewUrls(newPreviewUrls);
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="mb-4">
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    accept="image/*,.pdf,.doc,.docx"
                    className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                />
                <p className="mt-1 text-xs text-gray-500">
                    Supported formats: Images, PDF, DOC, DOCX (Max size: 5MB)
                </p>
            </div>

            {selectedFiles.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-sm font-medium mb-2">Selected Files:</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {selectedFiles.map((file, index) => (
                            <div key={index} className="relative p-2 border rounded-lg">
                                {previewUrls[index] ? (
                                    <img 
                                        src={previewUrls[index]} 
                                        alt={file.name}
                                        className="w-full h-32 object-cover rounded"
                                    />
                                ) : (
                                    <div className="w-full h-32 flex items-center justify-center bg-gray-100 rounded">
                                        <span className="text-gray-500">{file.name}</span>
                                    </div>
                                )}
                                <button
                                    onClick={() => removeFile(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                    ×
                                </button>
                                <p className="mt-1 text-xs text-gray-600 truncate">{file.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={isPending || selectedFiles.length === 0}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
            >
                {isPending ? 'Uploading...' : `Upload ${selectedFiles.length} Document${selectedFiles.length !== 1 ? 's' : ''}`}
            </button>

            {error && (
                <p className="mt-2 text-sm text-red-600">
                    Error uploading documents. Please try again.
                </p>
            )}
        </div>
    );
};

export default DocumentUploader; 