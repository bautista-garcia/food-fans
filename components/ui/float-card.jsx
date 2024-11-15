'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function FloatCard({
  children,
  title = "Floating Card",
  initialPosition = { x: 100, y: 100 },
  initialSize = { width: 400, height: 600 },
  minSize = { width: 300, height: 200 },
  maxSize = { width: 800, height: 1000 }
}) {
  const [position, setPosition] = useState(initialPosition)
  const [size, setSize] = useState(initialSize)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const cardRef = useRef(null)
  const dragStart = useRef({ x: 0, y: 0 })

  useEffect(() => {
    // Set initial position when component mounts
    setPosition(initialPosition)
  }, [initialPosition])

  const handleMouseDown = (e, action) => {
    e.preventDefault()
    if (action === 'drag') {
      setIsDragging(true)
      dragStart.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      }
    } else if (action === 'resize') {
      setIsResizing(true)
      dragStart.current = {
        x: e.clientX - size.width,
        y: e.clientY - size.height
      }
    }
  }

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.current.x
      const newY = e.clientY - dragStart.current.y

      // Prevent dragging outside viewport
      const maxX = window.innerWidth - size.width
      const maxY = window.innerHeight - size.height

      setPosition({
        x: Math.min(Math.max(0, newX), maxX),
        y: Math.min(Math.max(0, newY), maxY)
      })
    } else if (isResizing) {
      const newWidth = Math.max(
        minSize.width,
        Math.min(maxSize.width, e.clientX - dragStart.current.x)
      )
      const newHeight = Math.max(
        minSize.height,
        Math.min(maxSize.height, e.clientY - dragStart.current.y)
      )
      setSize({ width: newWidth, height: newHeight })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setIsResizing(false)
  }

  useEffect(() => {
    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing])

  return (
    <Card
      ref={cardRef}
      className="fixed backdrop-blur-md bg-white/90 shadow-lg border-none overflow-hidden"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: 10 // Ensure card stays above map
      }}
    >
      <CardHeader
        className="cursor-move p-4 bg-gray-50/50"
        onMouseDown={(e) => handleMouseDown(e, 'drag')}
      >
        <CardTitle className="text-lg font-semibold text-gray-800">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 overflow-auto h-[calc(100%-4rem)] custom-scrollbar">
        {children}
      </CardContent>

      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={(e) => handleMouseDown(e, 'resize')}
      />
    </Card>
  )
}