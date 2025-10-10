'use client'

import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Shark() {
  const meshRef = useRef<THREE.Group>(null)
  const [scrollY, setScrollY] = useState(0)

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight
      setScrollY(maxScroll > 0 ? scrollPosition / maxScroll : 0)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Create shark shape and animate idle motion
  useEffect(() => {
    if (meshRef.current) {
      // Animate idle swimming motion
      const animate = () => {
        if (meshRef.current) {
          const time = Date.now() * 0.001
          meshRef.current.rotation.y = Math.sin(time * 0.5) * 0.1
          meshRef.current.rotation.z = Math.sin(time * 0.7) * 0.05
        }
      }
      const interval = setInterval(animate, 16)
      return () => clearInterval(interval)
    }
  }, [])

  // Update position based on scroll
  useFrame(() => {
    if (meshRef.current) {
      // Shark swims down as user scrolls
      meshRef.current.position.y = 2 - scrollY * 8
      meshRef.current.position.x = Math.sin(scrollY * Math.PI * 2) * 2
    }
  })

  return (
    <group ref={meshRef} position={[0, 2, 0]}>
      {/* Shark Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Shark Head/Snout */}
      <mesh position={[0, 0, 1.2]} castShadow>
        <coneGeometry args={[0.6, 1.5, 32]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Dorsal Fin */}
      <mesh position={[0, 0.8, -0.3]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.4, 1.2, 3]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Left Pectoral Fin */}
      <mesh position={[-0.8, -0.2, 0.2]} rotation={[0, 0, -Math.PI / 4]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.6]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Right Pectoral Fin */}
      <mesh position={[0.8, -0.2, 0.2]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.6]} />
        <meshStandardMaterial
          color="#4a5568"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 0, -1.5]} rotation={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.6, 1.5, 3]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Tail Fin - Vertical */}
      <mesh position={[0, 0.3, -2.2]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 1, 0.8]} />
        <meshStandardMaterial
          color="#2d3748"
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>

      {/* Left Eye */}
      <mesh position={[-0.4, 0.3, 1.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Right Eye */}
      <mesh position={[0.4, 0.3, 1.5]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Belly - Lighter color */}
      <mesh position={[0, -0.6, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
        <ellipseCurve />
        <circleGeometry args={[0.6, 32]} />
        <meshStandardMaterial
          color="#cbd5e0"
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

function Scene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#6366f1" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#06b6d4" />

      {/* Shark */}
      <Shark />

      {/* Bubbles */}
      {[...Array(15)].map((_, i) => {
        const x = (Math.random() - 0.5) * 10
        const y = Math.random() * 10 - 5
        const z = (Math.random() - 0.5) * 5
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.05 + Math.random() * 0.05, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              transparent
              opacity={0.3}
              metalness={0.1}
              roughness={0.1}
            />
          </mesh>
        )
      })}
    </>
  )
}

export default function AnimatedShark() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        style={{ background: 'transparent' }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
