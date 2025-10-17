<img width="3073" height="3762" alt="Mermaid Chart - Create complex, visual diagrams with text -2025-10-15-080821" src="https://github.com/user-attachments/assets/090e4cc2-d741-4ff6-babe-51a16619e1fc" /># File Manager

A modern file management application built with React, TanStack Query, and JSON Server.

## Features

- **Dashboard**: View, search, and sort files with pagination
- **Detail View**: Preview PDFs and images with navigation
- **File Upload**: Drag-and-drop or click to upload files
- **State Persistence**: Selected file and pagination persist across refreshes
- **Error Handling**: Error boundaries with fallback UI

## Tech Stack

- React 18
- Vite 5
- React Router 6
- TanStack Query 5
- JSON Server
- React PDF

## Getting Started

```bash
# Install dependencies
npm install

# Run both dev server and API
npm run dev
```

The app will run on `http://localhost:5173` and the API on `http://localhost:3001`.

## Project Structure

```
src/
├── api/          # API client
├── components/   # Reusable components
├── pages/        # Main pages
├── utils/        # Utilities (localStorage)
├── App.jsx       # Router setup
└── index.css     # Global styles
```

## Usage

### Dashboard
- Search files by name or uploader
- Sort by clicking column headers
- Change items per page (5, 10, 20, 50)
- Click file name to view details

### Detail View
- Left panel shows file cards
- Right panel previews selected file
- Use Previous/Next to navigate
- PDF zoom controls for PDF files

### Upload
- Click "Add Document" button
- Drag & drop or click to browse
- Supports: PDF, PNG, JPEG, JPG, GIF

## State Persistence

The app uses localStorage to persist:
- Selected file ID
- Pagination settings (page, page size)

No query parameters are used in URLs.

## TODO (Future Scope)

- Responsiveness
- Better icons
- Date Range filter for files
- Single scroll view for multi paged PDFs. Currently there is button based approach
- Security stuffs

## Screenshots

<img width="1435" height="690" alt="image" src="https://github.com/user-attachments/assets/7848a3fd-ac53-430f-91f7-1a823d6a99e9" />
<img width="1435" height="690" alt="image" src="https://github.com/user-attachments/assets/06f9f46f-d302-4e04-b284-44adacc27693" />
<img width="1435" height="690" alt="image" src="https://github.com/user-attachments/assets/d230ead0-8cbf-4a47-bc88-2ad6be7202be" />
<img width="1435" height="690" alt="image" src="https://github.com/user-attachments/assets/0c2132b2-d5d7-4608-b385-c0a906dc57d7" />
<img width="1435" height="690" alt="image" src="https://github.com/user-attachments/assets/8cadaecd-d457-4a5a-93f7-bde05a89e3df" />
<img width="1435" height="690" alt="image" src="https://github.com/user-attachments/assets/463df26f-d10b-46ae-99f5-4900c9ab7c66" />
<img width="1435" height="690" alt="image" src="https://github.com/user-attachments/assets/b164ce7b-61d0-464b-9c80-d2913f7b2d68" />






