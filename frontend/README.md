# FinClassify Frontend

A React-based frontend application for the FinClassify financial document classification prototype.

## Features

- **Home Page**: Introduction to the FinClassify project
- **Upload Page**: CSV file upload with backend integration
- **Results Page**: Display predictions in a table and pie chart visualization
- **Contact Page**: Team information and contact details

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173` (or the port shown in the terminal).

## Usage

1. Navigate to the **Upload** page
2. Select a CSV file to classify
3. Click "Upload and Predict" to send the file to the backend
4. View results on the **Results** page, which includes:
   - Summary statistics (total rows, columns, column names)
   - Pie chart showing prediction distribution
   - Detailed table of all predictions

## Project Structure

```
frontend/
├── src/
│   ├── App.jsx          # Main app component with routing
│   ├── App.css          # Global styles
│   ├── main.jsx         # React entry point
│   └── pages/
│       ├── Home.jsx     # Home page with project intro
│       ├── Upload.jsx   # CSV upload page
│       ├── Results.jsx  # Results display with chart
│       └── Contact.jsx  # Contact/team info page
├── index.html           # HTML entry point
├── package.json         # Dependencies and scripts
└── README.md            # This file
```

## Dependencies

- **React** ^19.2.0 - UI library
- **React Router DOM** ^6.28.0 - Client-side routing
- **Chart.js** ^4.4.0 - Charting library
- **React Chart.js 2** ^5.2.0 - React wrapper for Chart.js
- **Vite** - Build tool and dev server

## Backend Integration

The frontend communicates with the backend API at `http://localhost:8000`:

- **POST /predict**: Uploads a CSV file and receives predictions + summary
- Predictions and summary are stored in `localStorage` for persistence

## Development

- **Development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`
- **Lint code**: `npm run lint`

## Notes

- The application uses React Router for client-side navigation
- Predictions are stored in localStorage and persist across page refreshes
- The Results page will redirect to Upload if no data is available
- The UI uses minimal, clean styling with a responsive design

