const API_URL = 'http://localhost:3001';

export const filesApi = {
  getAllFiles: async () => {
    const response = await fetch(`${API_URL}/files`);
    if (!response.ok) throw new Error('Failed to fetch files');
    return response.json();
  },

  getFileById: async (id) => {
    const response = await fetch(`${API_URL}/files/${id}`);
    if (!response.ok) throw new Error('Failed to fetch file');
    return response.json();
  },

  addFile: async (fileData) => {
    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    });
    if (!response.ok) throw new Error('Failed to add file');
    return response.json();
  },

  updateFile: async (id, fileData) => {
    const response = await fetch(`${API_URL}/files/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fileData),
    });
    if (!response.ok) throw new Error('Failed to update file');
    return response.json();
  },

  deleteFile: async (id) => {
    const response = await fetch(`${API_URL}/files/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete file');
    return response.json();
  },
};
