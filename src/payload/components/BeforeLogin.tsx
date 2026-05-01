'use client'

import { FaFire } from 'react-icons/fa6'

export default function BeforeLogin() {
  return (
    <div className="ssp-auth-header">
      <div className="ssp-auth-brand">
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 3px 12px rgba(234,88,12,0.4)',
          flexShrink: 0,
        }}>
          <FaFire style={{ color: 'white', width: 26, height: 26 }} />
        </div>
        <div>
          <h1 className="ssp-auth-title">Siva Sai Products</h1>
          <p className="ssp-auth-tagline">Pure Products for Pure Devotion</p>
        </div>
      </div>
      <div className="ssp-auth-divider" />
    </div>
  )
}
