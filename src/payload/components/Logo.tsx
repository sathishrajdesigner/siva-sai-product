'use client'

export default function Logo() {
  return (
    <div style={{ textAlign: 'center', padding: '0 0 8px' }}>
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '32px' }}>🪔</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{
            fontWeight: 700,
            fontSize: '20px',
            color: '#1a1a1a',
            letterSpacing: '-0.3px',
            lineHeight: 1.1,
          }}>
            Siva Sai
          </div>
          <div style={{
            fontSize: '11px',
            color: '#b45309',
            fontWeight: 500,
            letterSpacing: '0.8px',
            textTransform: 'uppercase',
          }}>
            Products Admin
          </div>
        </div>
      </div>
    </div>
  )
}
