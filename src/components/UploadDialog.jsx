import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { filesApi } from '../api/files';

const UploadDialog = ({ isOpen, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedBy, setUploadedBy] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: filesApi.addFile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] });
      handleClose();
    },
  });

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files[0]);
  };

  const validateAndSetFile = (file) => {
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (allowedTypes.includes(file.type)) {
      setSelectedFile(file);
    } else {
      alert('Please select a PDF or image file');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    console.log('Uploading file:', selectedFile);
    console.log(URL.createObjectURL(selectedFile));

    uploadMutation.mutate({
      id: Date.now().toString(),
      fileName: selectedFile.name,
      uploadedDate: new Date().toISOString(),
      uploadedBy: uploadedBy || 'Anonymous',
      fileType: selectedFile.type.includes('pdf') ? 'pdf' : 'image',
      fileUrl: URL.createObjectURL(selectedFile),
    });
  };

  const handleClose = () => {
    setSelectedFile(null);
    setUploadedBy('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div style={styles.overlay} onClick={handleClose}>
      <div style={styles.dialog} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Add Document</h2>
          <button style={styles.closeBtn} onClick={handleClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={{ ...styles.dropZone, ...(isDragging ? styles.dropZoneDragging : {}) }} onDragOver={handleDragOver} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop}>
            <input type="file" id="file-input" accept=".pdf,.png,.jpg,.jpeg,.gif" onChange={handleFileChange} style={styles.fileInput} />
            <label htmlFor="file-input" style={styles.dropZoneLabel}>
              {selectedFile ? (
                <div style={styles.selectedFile}>
                  <div style={styles.fileIcon}>📄</div>
                  <p style={styles.fileName}>{selectedFile.name}</p>
                  <p style={styles.fileSize}>{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <div style={styles.dropZoneContent}>
                  <div style={styles.uploadIcon}>📁</div>
                  <p style={styles.dropZoneText}>Drag & drop your file here</p>
                  <p style={styles.dropZoneSubtext}>or click to browse</p>
                  <p style={styles.dropZoneFormats}>Supported: PDF, PNG, JPEG, JPG, GIF</p>
                </div>
              )}
            </label>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Uploaded By (Optional)</label>
            <input type="text" value={uploadedBy} onChange={(e) => setUploadedBy(e.target.value)} placeholder="Enter your name" style={styles.input} />
          </div>

          <div style={styles.footer}>
            <button type="button" onClick={handleClose} style={styles.cancelBtn}>Cancel</button>
            <button type="submit" disabled={!selectedFile || uploadMutation.isPending} style={{ ...styles.submitBtn, ...(!selectedFile || uploadMutation.isPending ? styles.submitBtnDisabled : {}) }}>
              {uploadMutation.isPending ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  dialog: { backgroundColor: 'white', borderRadius: '12px', width: '90%', maxWidth: '540px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #E8E9EF' },
  title: { margin: 0, fontSize: '20px', fontWeight: '600', color: '#2D3748' },
  closeBtn: { background: 'none', border: 'none', fontSize: '32px', cursor: 'pointer', color: '#9CA3AF', lineHeight: '1', padding: 0, width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px' },
  form: { padding: '24px' },
  dropZone: { border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '40px', textAlign: 'center', cursor: 'pointer', marginBottom: '20px', backgroundColor: '#FAFBFC' },
  dropZoneDragging: { borderColor: '#6C5CE7', backgroundColor: '#F7F7FF' },
  fileInput: { display: 'none' },
  dropZoneLabel: { cursor: 'pointer', display: 'block' },
  dropZoneContent: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  uploadIcon: { fontSize: '48px', marginBottom: '16px' },
  dropZoneText: { fontSize: '16px', color: '#4A5568', marginBottom: '4px', fontWeight: '500' },
  dropZoneSubtext: { fontSize: '14px', color: '#9CA3AF', marginBottom: '12px' },
  dropZoneFormats: { fontSize: '12px', color: '#D1D5DB' },
  selectedFile: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  fileIcon: { fontSize: '48px', marginBottom: '12px' },
  fileName: { fontSize: '15px', color: '#2D3748', marginBottom: '4px', fontWeight: '500' },
  fileSize: { fontSize: '13px', color: '#9CA3AF' },
  inputGroup: { marginBottom: '24px' },
  label: { display: 'block', marginBottom: '8px', fontSize: '14px', color: '#4A5568', fontWeight: '500' },
  input: { width: '100%', padding: '10px 12px', border: '1px solid #E8E9EF', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  cancelBtn: { padding: '10px 20px', border: '1px solid #E8E9EF', borderRadius: '6px', backgroundColor: 'white', color: '#6B7280', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  submitBtn: { padding: '10px 20px', border: 'none', borderRadius: '6px', backgroundColor: '#6C5CE7', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '500' },
  submitBtnDisabled: { backgroundColor: '#D1D5DB', cursor: 'not-allowed' },
};

export default UploadDialog;
