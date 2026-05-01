'use client'

import { FaFire } from 'react-icons/fa6'

export default function Icon() {
  return (
    <div style={{
      width: 30, height: 30, borderRadius: '50%',
      background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 1px 4px rgba(234,88,12,0.4)',
    }}>
      <FaFire style={{ color: 'white', width: 14, height: 14 }} />
    </div>
  )
}
