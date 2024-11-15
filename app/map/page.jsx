'use client'

import { useState, useEffect, useCallback } from 'react'
import Map, { Marker, Popup, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_FALLBACK_PUBLIC_TOKEN'

export default function MapPage() {
  const [reviews, setReviews] = useState([])
  const [selectedReview, setSelectedReview] = useState(null)
  const [filteredReviews, setFilteredReviews] = useState([])
  const [selectedTags, setSelectedTags] = useState([])
  const [minRating, setMinRating] = useState(1)
  const [viewState, setViewState] = useState({
    longitude: -57.9545,
    latitude: -34.9205,
    zoom: 13,
  })

  // Add state for sidebar position
  const [isDragging, setIsDragging] = useState(false)
  const [sidebarWidth, setSidebarWidth] = useState(350) // Initial width in pixels

  const handleMouseDown = (e) => {
    setIsDragging(true)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      const newWidth = window.innerWidth - e.clientX
      setSidebarWidth(Math.max(300, Math.min(600, newWidth))) // Min 300px, Max 600px
    }
  }, [isDragging])

  const handleMouseUp = () => {
    setIsDragging(false)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const mockReviews = [
      {
        id: 1,
        restaurantName: "La Pizza de Tano",
        location: 'La Plata, Buenos Aires',
        rating: 4,
        tags: ['pizza', 'italian'],
        latitude: -34.9205,
        longitude: -57.9536,
      },
      {
        id: 2,
        restaurantName: "El Rincón de las Empanadas",
        location: 'La Plata, Buenos Aires',
        rating: 5,
        tags: ['empanadas', 'argentinian'],
        latitude: -34.9215,
        longitude: -57.9545,
      },
      {
        id: 3,
        restaurantName: "Parrilla Don Carlos",
        location: 'La Plata, Buenos Aires',
        rating: 4,
        tags: ['asado', 'argentinian'],
        latitude: -34.9195,
        longitude: -57.9526,
      },
      {
        id: 4,
        restaurantName: "Café Martinez",
        location: 'La Plata, Buenos Aires',
        rating: 5,
        tags: ['coffee', 'pastries'],
        latitude: -34.9225,
        longitude: -57.9556,
      },
      {
        id: 5,
        restaurantName: "La Trattoria",
        location: 'La Plata, Buenos Aires',
        rating: 4,
        tags: ['pasta', 'italian'],
        latitude: -34.9185,
        longitude: -57.9516,
      },
    ]
    setReviews(mockReviews)
  }, [])

  const getAllTags = useCallback(() => {
    const tags = new Set()
    reviews.forEach(review => {
      review.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags)
  }, [reviews])

  useEffect(() => {
    let filtered = reviews

    if (selectedTags.length > 0) {
      filtered = filtered.filter(review =>
        review.tags.some(tag => selectedTags.includes(tag))
      )
    }

    filtered = filtered.filter(review => review.rating >= minRating)

    setFilteredReviews(filtered)
  }, [reviews, selectedTags, minRating])

  const handleReviewClick = useCallback((review) => {
    setSelectedReview(review)
    setViewState({
      longitude: review.longitude,
      latitude: review.latitude,
      zoom: 12,
    })
  }, [])

  return (
    <div className="flex h-screen relative">
      <div className="flex-grow h-full">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {filteredReviews.map(review => (
            <Marker
              key={review.id}
              longitude={review.longitude}
              latitude={review.latitude}
              onClick={e => {
                e.originalEvent.stopPropagation()
                setSelectedReview(review)
              }}
            >
              <div className="text-2xl cursor-pointer">📍</div>
            </Marker>
          ))}

          {selectedReview && (
            <Popup
              longitude={selectedReview.longitude}
              latitude={selectedReview.latitude}
              onClose={() => setSelectedReview(null)}
              closeOnClick={false}
            >
              <div className="p-2">
                <h3 className="font-semibold">{selectedReview.restaurantName}</h3>
                <p className="text-sm">{selectedReview.location}</p>
                <p className="text-sm">Rating: {selectedReview.rating}/5</p>
                <p className="text-sm">Tags: {selectedReview.tags.join(', ')}</p>
              </div>
            </Popup>
          )}
        </Map>
      </div>

      {/* Draggable Sidebar */}
      <div
        className="absolute top-0 right-0 h-full bg-white shadow-lg custom-scrollbar"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Drag Handle */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-gray-300 transition-colors"
          onMouseDown={handleMouseDown}
        />

        <div className="p-6 h-full overflow-y-auto">
          <h2 className="text-xl font-light mb-6 text-gray-800">Food Reviews</h2>

          {/* Filter Section */}
          <div className="mb-6 space-y-4">
            <div>
              <label className="text-sm text-gray-500 mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {getAllTags().map(tag => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTags(prev =>
                      prev.includes(tag)
                        ? prev.filter(t => t !== tag)
                        : [...prev, tag]
                    )}
                    className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${selectedTags.includes(tag)
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-500 mb-2 block">
                Rating {minRating}+
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
                className="w-full accent-gray-900"
              />
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3">
            {filteredReviews.map(review => (
              <div
                key={review.id}
                onClick={() => handleReviewClick(review)}
                className="p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-gray-50 border border-transparent hover:border-gray-100"
              >
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-medium text-gray-900">{review.restaurantName}</h3>
                  <span className="text-sm text-gray-500">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-1">{review.location}</p>
                <div className="flex flex-wrap gap-1">
                  {review.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}