# File Manager

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