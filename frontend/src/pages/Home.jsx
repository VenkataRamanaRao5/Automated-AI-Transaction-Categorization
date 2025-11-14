import { Link } from 'react-router-dom'
import '../App.css'

function Home() {
  return (
    <div className="page-container">
      <h1 className="page-title">Welcome to FinClassify</h1>
      <div className="page-content">
        <p>
          FinClassify is a prototype application for classifying financial documents
          using machine learning. Upload your CSV files containing financial data,
          and our system will automatically categorize and analyze them.
        </p>
        <p style={{ marginTop: '1rem' }}>
          This tool helps financial analysts and organizations streamline their
          document processing workflow by providing quick and accurate classification
          of financial documents.
        </p>
        <div style={{ marginTop: '2rem' }}>
          <Link to="/upload" className="button">
            Get Started - Upload CSV
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

