import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { filesApi } from '../api/files';
import { storage } from '../utils/storage';
import UploadDialog from '../components/UploadDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import Sidebar from '../components/Sidebar';

const Dashboard = () => {
  const navigate = useNavigate();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'uploadedDate', direction: 'desc' });
  
  const initialPagination = storage.getPagination();
  const [currentPage, setCurrentPage] = useState(initialPagination.page);
  const [pageSize, setPageSize] = useState(initialPagination.pageSize);

  useEffect(() => {
    storage.setPagination({ page: currentPage, pageSize });
  }, [currentPage, pageSize]);

  const { data: files = [], isLoading, error } = useQuery({
    queryKey: ['files'],
    queryFn: filesApi.getAllFiles,
  });

  const filteredAndSortedFiles = useMemo(() => {
    let result = [...files];

    if (searchTerm) {
      result = result.filter(file =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        file.uploadedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'uploadedDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [files, searchTerm, sortConfig]);

  const paginatedFiles = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedFiles.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedFiles, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedFiles.length / pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleFileClick = (fileId) => {
    storage.setSelectedFile(fileId);
    navigate('/details');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return ' ↕';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.mainContent}>
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Sidebar />
        <div style={styles.mainContent}>
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>Error loading files: {error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <Sidebar />
      
      <div style={styles.mainContent}>
        <header style={styles.header}>
          <h1 style={styles.title}>Dashboard</h1>
          <div style={styles.headerRight}>
            <input
              type="text"
              placeholder="🔍 Search files..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              style={styles.searchInput}
            />
            <button style={styles.addButton} onClick={() => setIsUploadDialogOpen(true)}>
              📄 Add Document
            </button>
          </div>
        </header>

        <div style={styles.content}>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.tableHeader} onClick={() => handleSort('fileName')}>
                    File Name{getSortIndicator('fileName')}
                  </th>
                  <th style={styles.tableHeader} onClick={() => handleSort('uploadedDate')}>
                    Date{getSortIndicator('uploadedDate')}
                  </th>
                  <th style={styles.tableHeader} onClick={() => handleSort('uploadedBy')}>
                    Uploaded By{getSortIndicator('uploadedBy')}
                  </th>
                  <th style={styles.tableHeader}>
                    Uploaded At
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedFiles.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={styles.noData}>
                      {searchTerm ? 'No files found' : 'No files uploaded yet'}
                    </td>
                  </tr>
                ) : (
                  paginatedFiles.map((file) => (
                    <tr key={file.id} style={styles.tableRow}>
                      <td style={{ ...styles.tableCell, ...styles.fileNameCell }} onClick={() => handleFileClick(file.id)}>
                        {file.fileName}
                      </td>
                      <td style={styles.tableCell}>{formatDate(file.uploadedDate)}</td>
                      <td style={styles.tableCell}>{file.uploadedBy}</td>
                      <td style={styles.tableCell}>{formatDateTime(file.uploadedDate)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={styles.pagination}>
            <div style={styles.paginationLeft}>
              <span>Items per page:</span>
              <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }} style={styles.select}>
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <span style={styles.paginationCenter}>
              {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredAndSortedFiles.length)} of {filteredAndSortedFiles.length}
            </span>

            <div style={styles.paginationRight}>
              <button style={styles.pageBtn} onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>←</button>
              <button style={styles.pageBtn} onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>→</button>
            </div>
          </div>
        </div>
      </div>

      <UploadDialog isOpen={isUploadDialogOpen} onClose={() => setIsUploadDialogOpen(false)} />
    </div>
  );
};

const styles = {
  container: { display: 'flex', minHeight: '100vh', backgroundColor: '#F5F6FA' },
  mainContent: { flex: 1, display: 'flex', flexDirection: 'column' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 40px', backgroundColor: 'white', borderBottom: '1px solid #E8E9EF' },
  title: { fontSize: '24px', fontWeight: '600', color: '#2D3748', margin: 0 },
  headerRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  searchInput: { padding: '10px 16px', fontSize: '14px', border: '1px solid #E8E9EF', borderRadius: '6px', width: '280px', backgroundColor: 'white' },
  addButton: { padding: '10px 20px', backgroundColor: '#F7F7FF', color: '#6C5CE7', border: '1px solid #E8E9EF', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer' },
  content: { flex: 1, padding: '24px 40px' },
  tableWrapper: { backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeaderRow: { backgroundColor: '#FAFBFC', borderBottom: '2px solid #E8E9EF' },
  tableHeader: { padding: '16px 20px', textAlign: 'left', fontSize: '13px', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', cursor: 'pointer', userSelect: 'none' },
  tableRow: { borderBottom: '1px solid #F0F1F5' },
  tableCell: { padding: '16px 20px', fontSize: '14px', color: '#4A5568' },
  fileNameCell: { color: '#6C5CE7', fontWeight: '500', cursor: 'pointer' },
  noData: { padding: '60px', textAlign: 'center', color: '#9CA3AF', fontSize: '15px' },
  pagination: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '16px 0' },
  paginationLeft: { display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#6B7280' },
  paginationCenter: { flex: 1, textAlign: 'center', fontSize: '14px', color: '#6B7280' },
  paginationRight: { display: 'flex', gap: '8px' },
  select: { padding: '6px 12px', border: '1px solid #E8E9EF', borderRadius: '4px', fontSize: '14px', color: '#4A5568', backgroundColor: 'white', cursor: 'pointer' },
  pageBtn: { padding: '8px 12px', border: '1px solid #E8E9EF', borderRadius: '4px', backgroundColor: 'white', color: '#6B7280', cursor: 'pointer', fontSize: '14px' },
  errorContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' },
  errorText: { color: '#EF4444', fontSize: '16px' },
};

export default Dashboard;
