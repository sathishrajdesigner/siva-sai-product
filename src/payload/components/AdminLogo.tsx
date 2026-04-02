import React from 'react'

export default function AdminLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #f97316, #ea580c)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          flexShrink: 0,
        }}
      >
        🪔
      </div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', lineHeight: 1.2 }}>
          Siva Sai Products
        </div>
        <div style={{ fontSize: 11, color: '#f97316', letterSpacing: '0.05em' }}>
          Admin Panel
        </div>
      </div>
    </div>
  )
}
