import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import '../App.css'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

function Results() {
  const [predictions, setPredictions] = useState([])
  const [summary, setSummary] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const navigate = useNavigate()

  useEffect(() => {
    // Load predictions and summary from localStorage
    const storedPredictions = localStorage.getItem('predictions')
    const storedSummary = localStorage.getItem('summary')

    if (storedPredictions) {
      setPredictions(JSON.parse(storedPredictions))
    }

    if (storedSummary) {
      setSummary(JSON.parse(storedSummary))
    }

    // If no data, redirect to upload
    if (!storedPredictions && !storedSummary) {
      navigate('/upload')
    }
  }, [navigate])

  const toggleRow = (index) => {
    const newExpanded = new Set(expandedRows)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedRows(newExpanded)
  }

  // Calculate category counts for pie chart
  const getCategoryCounts = () => {
    const counts = {}
    predictions.forEach((pred) => {
      // Handle both old format (string) and new format (object with category)
      const category = typeof pred === 'string' ? pred : pred.category
      counts[category] = (counts[category] || 0) + 1
    })
    return counts
  }

  const categoryCounts = getCategoryCounts()
  const categories = Object.keys(categoryCounts)
  const counts = Object.values(categoryCounts)

  // Chart.js data configuration
  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Predictions',
        data: counts,
        backgroundColor: [
          '#3498db',
          '#2ecc71',
          '#e74c3c',
          '#f39c12',
          '#9b59b6',
          '#1abc9c',
        ],
        borderWidth: 1,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  }

  if (!predictions.length && !summary) {
    return (
      <div className="page-container">
        <p>No results available. Please upload a file first.</p>
      </div>
    )
  }

  return (
    <div className="page-container">
      <h1 className="page-title">Prediction Results</h1>

      {summary && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
            Summary
          </h2>
          <p><strong>Total Rows:</strong> {summary.total_rows}</p>
          <p><strong>Total Columns:</strong> {summary.total_columns}</p>
          {summary.column_names && (
            <p>
              <strong>Columns:</strong> {summary.column_names.join(', ')}
            </p>
          )}
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
          Predictions Distribution
        </h2>
        <div className="chart-container">
          <Pie data={chartData} options={chartOptions} />
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>
          Detailed Predictions
        </h2>
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>Row #</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction, index) => {
              const category = typeof prediction === 'string' ? prediction : prediction.category
              const explanation = typeof prediction === 'object' ? prediction.explanation : null
              const isExpanded = expandedRows.has(index)
              
              return (
                <React.Fragment key={index}>
                  <tr 
                    className={explanation ? "expandable-row" : ""}
                    onClick={() => explanation && toggleRow(index)}
                  >
                    <td>
                      {explanation && (
                        <span style={{ marginRight: '0.5rem' }}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      )}
                    </td>
                    <td>{index + 1}</td>
                    <td>{category}</td>
                  </tr>
                  {isExpanded && explanation && (
                    <tr key={`${index}-expanded`}>
                      <td colSpan="3">
                        <div className="expanded-content">
                          <div className="explanation-section">
                            <h4>Explanation</h4>
                            {explanation.tokens && (
                              <div className="explanation-item">
                                <span className="explanation-label">Tokens:</span>
                                <span className="explanation-value">
                                  {Array.isArray(explanation.tokens) 
                                    ? explanation.tokens.join(', ') 
                                    : explanation.tokens}
                                </span>
                              </div>
                            )}
                            {explanation.rule_triggered && (
                              <div className="explanation-item">
                                <span className="explanation-label">Rule Triggered:</span>
                                <span className="explanation-value">
                                  {explanation.rule_triggered}
                                </span>
                              </div>
                            )}
                            {explanation.nearest_merchants && (
                              <div className="explanation-item">
                                <span className="explanation-label">Nearest Merchants:</span>
                                <span className="explanation-value">
                                  {Array.isArray(explanation.nearest_merchants)
                                    ? explanation.nearest_merchants.join(', ')
                                    : explanation.nearest_merchants}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Results

