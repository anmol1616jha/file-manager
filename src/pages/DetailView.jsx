import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { filesApi } from '../api/files';
import { storage } from '../utils/storage';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const DetailView = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  
  const initialSelectedId = storage.getSelectedFile();
  const [selectedFileId, setSelectedFileId] = useState(initialSelectedId);

  const { data: files = [], isLoading } = useQuery({
    queryKey: ['files'],
    queryFn: filesApi.getAllFiles,
  });

  const selectedFile = files.find(f => f.id === selectedFileId);

  useEffect(() => {
    if (selectedFileId) storage.setSelectedFile(selectedFileId);
  }, [selectedFileId]);

  useEffect(() => {
    if (!selectedFileId && files.length > 0) setSelectedFileId(files[0].id);
  }, [files, selectedFileId]);

  useEffect(() => {
    if (selectedFileId && files.length > 0) {
      const currentIndex = files.findIndex(f => f.id === selectedFileId);
      if (currentIndex !== -1) {
        setCurrentPage(Math.floor(currentIndex / itemsPerPage) + 1);
      }
    }
  }, [selectedFileId, files, itemsPerPage]);

  const paginatedFiles = files.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(files.length / itemsPerPage);

  const handleFileSelect = (fileId) => {
    setSelectedFileId(fileId);
    setPageNumber(1);
  };

  const handleNext = () => {
    const currentIndex = files.findIndex(f => f.id === selectedFileId);
    if (currentIndex < files.length - 1) {
      setSelectedFileId(files[currentIndex + 1].id);
      setPageNumber(1);
    }
  };

  const handlePrevious = () => {
    const currentIndex = files.findIndex(f => f.id === selectedFileId);
    if (currentIndex > 0) {
      setSelectedFileId(files[currentIndex - 1].id);
      setPageNumber(1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.mainContent}><LoadingSpinner /></div>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.emptyState}>
          <h2>No files available</h2>
          <p>Upload some files to get started</p>
        </div>
      </div>
    );
  }

  const currentIndex = files.findIndex(f => f.id === selectedFileId);

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <div style={styles.mainContent}>
        <div style={styles.contentWrapper}>
          <div style={styles.leftPanel}>
            <div style={styles.fileList}>
              {paginatedFiles.map((file) => (
                <div key={file.id} style={{ ...styles.fileCard, ...(file.id === selectedFileId ? styles.fileCardActive : {}) }} onClick={() => handleFileSelect(file.id)}>
                  <div style={styles.fileCardHeader}>
                    <span style={styles.fileType}>{file.fileType === 'pdf' ? 'VAT' : 'Image'}</span>
                  </div>
                  <div style={styles.fileCardContent}>
                    <h4 style={styles.fileCardTitle}>{file.fileName}</h4>
                    <div style={styles.fileCardMeta}>
                      <span style={styles.fileCardDate}>Date: {formatDate(file.uploadedDate)}</span>
                      <span style={styles.fileCardType}>Type: {file.fileType === 'pdf' ? 'purchases' : 'sales'}</span>
                    </div>
                    <span style={styles.statusBadge}>Success</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={styles.fileListPagination}>
              <button style={styles.paginationBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Prev</button>
              <span style={styles.paginationText}>{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, files.length)}</span>
              <button style={styles.paginationBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Next</button>
            </div>
          </div>

          <div style={styles.rightPanel}>
            {selectedFile ? (
              <>
                <div style={styles.previewHeader}>
                  <div>
                    <h3 style={styles.previewTitle}>{selectedFile.fileName}</h3>
                    <p style={styles.previewSubtitle}>From here navigate in doc list</p>
                  </div>
                  <div style={styles.navigationButtons}>
                    <button style={styles.navButton} onClick={handlePrevious} disabled={currentIndex === 0}>‹</button>
                    <span style={styles.documentCount}>Document {currentIndex + 1}/{files.length}</span>
                    <button style={styles.navButton} onClick={handleNext} disabled={currentIndex === files.length - 1}>›</button>
                  </div>
                </div>

                <div style={styles.previewContent}>
                  <div style={styles.previewBox}>
                    {selectedFile.fileType === 'pdf' ? (
                      <div style={styles.pdfViewer}>
                        <Document
                          file={{url: selectedFile.fileUrl}}
                          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                          onLoadError={(error) => console.error('PDF Load Error', error)}
                          loading={<LoadingSpinner />}
                          error={
                            <div style={styles.errorMessage}>
                              <p>Unable to load PDF preview</p>
                              <p style={styles.errorSubtext}>Demo mode - actual PDFs would display here</p>
                            </div>
                          }
                          options={{
                            cMapUrl: 'https://unpkg.com/pdfjs-dist@3.11.174/cmaps/',
                            cMapPacked: true,
                          }}
                        >
                          <Page pageNumber={pageNumber} width={Math.min(window.innerWidth * 0.55, 900)} renderTextLayer={false} renderAnnotationLayer={false} />
                        </Document>
                        {numPages && (
                          <div style={styles.pdfControls}>
                            <button style={styles.pdfControlBtn} onClick={() => setPageNumber(p => Math.max(1, p - 1))} disabled={pageNumber <= 1}>📄−</button>
                            <span style={styles.pageInfo}>PDF Page No. {pageNumber} / {numPages}</span>
                            <button style={styles.pdfControlBtn} onClick={() => setPageNumber(p => Math.min(numPages, p + 1))} disabled={pageNumber >= numPages}>📄+</button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div style={styles.imageViewer}>
                        <img src={selectedFile.fileUrl} alt={selectedFile.fileName} style={styles.image} onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="600" height="400"%3E%3Crect width="600" height="400" fill="%23f8f9fa"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-family="Arial" font-size="18"%3EImage Preview Unavailable%3C/text%3E%3C/svg%3E';
                        }} />
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div style={styles.noSelection}><p>Select a file to preview</p></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  contentWrapper: { display: 'flex', flex: 1, gap: '20px', padding: '24px' },
  leftPanel: { width: '300px', display: 'flex', flexDirection: 'column', gap: '15px' },
  fileList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  fileCard: { backgroundColor: 'white', borderRadius: '8px', padding: '16px', cursor: 'pointer', border: '2px solid transparent', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  fileCardActive: { border: '2px solid #6C5CE7', backgroundColor: '#F7F7FF' },
  fileCardHeader: { marginBottom: '8px' },
  fileType: { fontSize: '11px', fontWeight: '600', color: '#6C5CE7', textTransform: 'uppercase', letterSpacing: '0.5px' },
  fileCardContent: { display: 'flex', flexDirection: 'column', gap: '8px' },
  fileCardTitle: { margin: 0, fontSize: '14px', fontWeight: '600', color: '#2D3748', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileCardMeta: { display: 'flex', flexDirection: 'column', gap: '4px' },
  fileCardDate: { fontSize: '12px', color: '#6B7280' },
  fileCardType: { fontSize: '12px', color: '#6B7280' },
  statusBadge: { display: 'inline-block', padding: '4px 8px', backgroundColor: '#10B981', color: 'white', fontSize: '11px', fontWeight: '600', borderRadius: '4px', width: 'fit-content' },
  fileListPagination: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: 'white', borderRadius: '8px' },
  paginationBtn: { padding: '6px 12px', backgroundColor: 'white', border: '1px solid #E8E9EF', borderRadius: '4px', fontSize: '13px', color: '#6B7280', cursor: 'pointer' },
  paginationText: { fontSize: '13px', color: '#6B7280' },
  rightPanel: { flex: 1, backgroundColor: 'white', borderRadius: '12px', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
  previewHeader: { padding: '20px 24px', borderBottom: '1px solid #E8E9EF', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  previewTitle: { margin: 0, fontSize: '18px', fontWeight: '600', color: '#2D3748' },
  previewSubtitle: { margin: '4px 0 0 0', fontSize: '13px', color: '#9CA3AF' },
  navigationButtons: { display: 'flex', alignItems: 'center', gap: '12px' },
  navButton: { width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6C5CE7', color: 'white', border: 'none', borderRadius: '6px', fontSize: '20px', cursor: 'pointer' },
  documentCount: { fontSize: '13px', color: '#6B7280' },
  previewContent: { flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '24px', backgroundColor: '#FAFBFC' },
  previewBox: { maxWidth: '100%' },
  pdfViewer: { backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  pdfControls: { display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#FAFBFC', borderTop: '1px solid #E8E9EF' },
  pdfControlBtn: { padding: '8px 16px', backgroundColor: 'white', border: '1px solid #E8E9EF', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' },
  pageInfo: { fontSize: '14px', color: '#6B7280' },
  imageViewer: { backgroundColor: 'white', borderRadius: '8px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
  image: { maxWidth: '100%', height: 'auto', display: 'block', borderRadius: '4px' },
  noSelection: { flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#9CA3AF', fontSize: '16px' },
  emptyState: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '12px', color: '#6B7280' },
  errorMessage: { padding: '60px 40px', textAlign: 'center', color: '#EF4444' },
  errorSubtext: { marginTop: '12px', fontSize: '14px', color: '#9CA3AF' },
};

export default DetailView;
