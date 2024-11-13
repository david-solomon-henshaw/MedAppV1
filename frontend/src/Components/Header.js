import React from 'react'
import { FaHeart } from 'react-icons/fa'

const Header = () => {
  return (
    <div>
       <header className="pt-4 pb-2">
        <div className="d-flex align-items-center" style={{ color: 'rgba(12, 150, 230, 1)', marginLeft: '20px' }}>
          <FaHeart className="me-2 fs-3" />
          <h1 className="fs-6 fw-medium m-0" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
            JKL Healthcare Services
          </h1>
        </div>
      </header>

    </div>
  )
}

export default Header