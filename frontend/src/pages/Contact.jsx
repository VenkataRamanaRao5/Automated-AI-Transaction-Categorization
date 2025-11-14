import '../App.css'

function Contact() {
  const teamMembers = [
    {
      name: 'Sachin K S',
      role: 'Member',
      email: 'john.doe@finclassify.com',
    },
    {
      name: 'VenkatRamana Rao C V',
      role: 'Member',
      email: 'jane.smith@finclassify.com',
    },
    {
      name: 'Yugash D',
      role: 'Member',
      email: 'bob.johnson@finclassify.com',
    },
    {
      name: 'Priya',
      role: 'Member',
      email: 'alice.williams@finclassify.com',
    },
  ]

  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>
      <div className="page-content">
        <p style={{ marginBottom: '2rem' }}>
          Have questions or feedback? Reach out to our team members below.
        </p>

        <div style={{ display: 'grid', gap: '1.5rem', marginTop: '2rem' }}>
          {teamMembers.map((member, index) => (
            <div
              key={index}
              style={{
                padding: '1.5rem',
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: '#f9f9f9',
              }}
            >
              <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>
                {member.name}
              </h3>
              <p style={{ color: '#7f8c8d', marginBottom: '0.5rem' }}>
                {member.role}
              </p>
              <p style={{ color: '#3498db' }}>
                <a
                  href={`mailto:${member.email}`}
                  style={{ color: '#3498db', textDecoration: 'none' }}
                >
                  {member.email}
                </a>
              </p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#ecf0f1', borderRadius: '4px' }}>
          <p style={{ margin: 0 }}>
            <strong>General Inquiries:</strong> info@finclassify.com
          </p>
        </div>
      </div>
    </div>
  )
}

export default Contact

