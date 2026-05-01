'use client'

import { FaFire } from 'react-icons/fa6'

export default function Logo() {
  return (
    <div style={{ textAlign: 'center', padding: '0 0 8px' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: 42, height: 42, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 8px rgba(234,88,12,0.35)',
          flexShrink: 0,
        }}>
          <FaFire style={{ color: 'white', width: 20, height: 20 }} />
        </div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontWeight: 700, fontSize: '20px', color: '#1a1a1a', letterSpacing: '-0.3px', lineHeight: 1.1 }}>
            Siva Sai
          </div>
          <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>
            Products Admin
          </div>
        </div>
      </div>
    </div>
  )
}
