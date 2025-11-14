import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

function Upload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showTaxonomyModal, setShowTaxonomyModal] = useState(false)
  const [taxonomy, setTaxonomy] = useState(null)
  const [taxonomyText, setTaxonomyText] = useState('')
  const [taxonomyLoading, setTaxonomyLoading] = useState(false)
  const [taxonomyError, setTaxonomyError] = useState(null)
  const [taxonomySuccess, setTaxonomySuccess] = useState(null)
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

  const handleOpenTaxonomyModal = async () => {
    setShowTaxonomyModal(true)
    setTaxonomyError(null)
    setTaxonomySuccess(null)
    setTaxonomyLoading(true)

    try {
      const response = await fetch('http://localhost:8000/taxonomy')
      if (!response.ok) {
        throw new Error('Failed to fetch taxonomy')
      }
      const data = await response.json()
      setTaxonomy(data)
      setTaxonomyText(JSON.stringify(data, null, 2))
    } catch (err) {
      setTaxonomyError(err.message || 'Failed to load taxonomy')
    } finally {
      setTaxonomyLoading(false)
    }
  }

  const handleCloseTaxonomyModal = () => {
    setShowTaxonomyModal(false)
    setTaxonomy(null)
    setTaxonomyText('')
    setTaxonomyError(null)
    setTaxonomySuccess(null)
  }

  const handleSaveTaxonomy = async () => {
    setTaxonomyLoading(true)
    setTaxonomyError(null)
    setTaxonomySuccess(null)

    try {
      // Validate JSON
      const parsed = JSON.parse(taxonomyText)

      const response = await fetch('http://localhost:8000/taxonomy/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ taxonomy: parsed }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Failed to update taxonomy')
      }

      setTaxonomySuccess('Taxonomy updated successfully!')
      setTaxonomy(parsed)
    } catch (err) {
      if (err instanceof SyntaxError) {
        setTaxonomyError('Invalid JSON format: ' + err.message)
      } else {
        setTaxonomyError(err.message || 'Failed to update taxonomy')
      }
    } finally {
      setTaxonomyLoading(false)
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

      <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #ddd' }}>
        <button
          type="button"
          className="button-secondary"
          onClick={handleOpenTaxonomyModal}
        >
          Edit Taxonomy
        </button>
      </div>

      {showTaxonomyModal && (
        <div className="modal-overlay" onClick={handleCloseTaxonomyModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Edit Taxonomy</h2>
              <button className="modal-close" onClick={handleCloseTaxonomyModal}>
                ×
              </button>
            </div>
            <div className="modal-body">
              {taxonomyLoading && !taxonomy && <p>Loading taxonomy...</p>}
              {taxonomyError && <div className="error">{taxonomyError}</div>}
              {taxonomySuccess && <div className="success">{taxonomySuccess}</div>}
              {taxonomy && (
                <textarea
                  className="textarea-json"
                  value={taxonomyText}
                  onChange={(e) => setTaxonomyText(e.target.value)}
                  placeholder="Enter taxonomy JSON..."
                />
              )}
            </div>
            <div className="modal-footer">
              <button
                className="button-secondary"
                onClick={handleCloseTaxonomyModal}
              >
                Cancel
              </button>
              <button
                className="button"
                onClick={handleSaveTaxonomy}
                disabled={taxonomyLoading || !taxonomyText}
              >
                {taxonomyLoading ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Upload

