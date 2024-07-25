# Docuboost: Your AI-powered Proofreading Assistant

Docuboost is a web application that utilizes the power of artificial
intelligence to assist you in proofreading your documents. It highlights
potential mistakes, allowing you to easily identify and correct them, ensuring
your writing is polished and error-free.

## Features

- AI-powered Proofreading: Docuboost leverages Gramformer, a powerful AI model,
  to analyze your documents and identify grammatical errors, spelling mistakes,
  and stylistic inconsistencies.
- Supported File Formats: Upload documents in various formats, including **PDF**
  (.pdf), **DOCX** (.docx), **DOC** (.doc), and **plain text** (.txt).
- Interactive Corrections: Easily review and address highlighted errors directly
  within the Docuboost interface.
- User History (Requires Sign-in): Sign in with Auth0 to access your
  proofreading history and revisit previously corrected documents Login
  functionality requires sign-in..
- Simple and Intuitive Interface: Docuboost provides a user-friendly interface
  for seamless document upload, correction, and download.

## Installation

Docuboost consists of three main components: frontend, backend, and correction
server. Here's how to set up each one:

1. Frontend (React):

   Navigate to the frontend directory in your project. Run `npm install` to
   install the required frontend dependencies.

2. Backend (Express):

   Navigate to the backend directory in your project. Run `npm install` to
   install the required backend dependencies.

3. Correction Server (Flask):

   Navigate to the correction_server directory in your project. Run
   `pip install requirements.txt` to install the required Python dependencies.

## Running the application:

- Start the Frontend:

  - In the frontend directory, run npm start to launch the React application.
    This will typically be accessible at http://localhost:3000.

- Start the Backend:

  - In the backend directory, run npm start to start the Express server. This
    will typically be accessible at http://localhost:3000.

- Start the Correction Server:
  - In the correction_server directory, run python correction.py to launch the
    Flask server handling AI corrections. This will typically be accessible at
    http://127.0.0.1:5000/correct.

Note: The actual port numbers might vary depending on your system configuration.

## Technologies Used

- Frontend: React
- Backend: Express
- Correction Server: Flask AI
- Correction: Gramformer
- Text Extraction: textract.js and pdfMiner.six
- Authentication: Auth0

## Usage

- Access Docuboost: Open your web browser and navigate to http://localhost:3000.
- Upload a Document: Click the "Upload Document" button and select the document
  you want to proofread.
- Review Corrections: Docuboost will analyze your document and highlight
  potential errors.
- Make Corrections: Click on highlighted sections to view suggestions and make
  necessary corrections.
- Download Corrected Document: Once satisfied, click "Download" to save your
  corrected document.

Sign in with Auth0 to access and manage your proofreading history.
