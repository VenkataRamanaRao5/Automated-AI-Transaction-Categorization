import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function Upload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      if (selectedFile.type === 'text/csv' || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile)
        setError(null)
      } else {
        setError('Please upload a CSV file')
        setFile(null)
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!file) {
      setError('Please select a CSV file')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to process file')
      }

      const data = await response.json()
      
      // Store predictions and summary in localStorage
      localStorage.setItem('predictions', JSON.stringify(data.predictions))
      localStorage.setItem('summary', JSON.stringify(data.summary))
      
      // Navigate to results page
      navigate('/results')
    } catch (err) {
      setError(err.message || 'An error occurred while processing the file')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Upload CSV File</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="csv-file" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Select a CSV file to classify:
          </label>
          <input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="input-file"
            disabled={loading}
          />
        </div>

        {file && (
          <div style={{ marginTop: '1rem', color: '#555' }}>
            Selected file: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(2)} KB)
          </div>
        )}

        {error && <div className="error">{error}</div>}

        <button
          type="submit"
          className="button"
          disabled={!file || loading}
          style={{ marginTop: '1.5rem' }}
        >
          {loading ? 'Processing...' : 'Upload and Predict'}
        </button>
      </form>
    </div>
  )
}

export default Upload

