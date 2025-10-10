'use client'

import { useEffect, useState } from 'react'
import './shark.css'

export default function AnimatedShark() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className="shark-container"
      style={{
        top: `${scrollProgress}%`,
      }}
    >
      <div className="shark">
        {/* Shark Body */}
        <div className="shark-body">
          {/* Main body */}
          <div className="body-main"></div>

          {/* Head/Snout */}
          <div className="shark-head"></div>

          {/* Dorsal Fin */}
          <div className="dorsal-fin"></div>

          {/* Tail */}
          <div className="tail-section">
            <div className="tail-base"></div>
            <div className="tail-fin"></div>
          </div>

          {/* Pectoral Fins */}
          <div className="pectoral-fin pectoral-fin-left"></div>
          <div className="pectoral-fin pectoral-fin-right"></div>

          {/* Eyes */}
          <div className="eye eye-left"></div>
          <div className="eye eye-right"></div>

          {/* Gills */}
          <div className="gills">
            <div className="gill"></div>
            <div className="gill"></div>
            <div className="gill"></div>
          </div>

          {/* Belly */}
          <div className="belly"></div>
        </div>
      </div>
    </div>
  )
}
