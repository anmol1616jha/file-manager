const KEYS = {
  SELECTED_FILE: 'fileManager_selectedFile',
  PAGINATION: 'fileManager_pagination',
};

export const storage = {
  getSelectedFile: () => {
    const data = localStorage.getItem(KEYS.SELECTED_FILE);
    return data ? JSON.parse(data) : null;
  },

  setSelectedFile: (fileId) => {
    localStorage.setItem(KEYS.SELECTED_FILE, JSON.stringify(fileId));
  },

  clearSelectedFile: () => {
    localStorage.removeItem(KEYS.SELECTED_FILE);
  },

  getPagination: () => {
    const data = localStorage.getItem(KEYS.PAGINATION);
    return data ? JSON.parse(data) : { page: 1, pageSize: 10 };
  },

  setPagination: (pagination) => {
    localStorage.setItem(KEYS.PAGINATION, JSON.stringify(pagination));
  },

  clearPagination: () => {
    localStorage.removeItem(KEYS.PAGINATION);
  },
};
