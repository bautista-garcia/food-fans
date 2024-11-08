'use client'

import { useState, useEffect, useCallback } from 'react'
import Map, { Marker, Popup, ViewState } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'



const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'YOUR_FALLBACK_PUBLIC_TOKEN'

export default function MapPage() {
  const [reviews, setReviews] = useState([])
  const [selectedReview, setSelectedReview] = useState(null)
  const [viewState, setViewState] = useState({
    longitude: -98.5795,
    latitude: 39.8283,
    zoom: 3,
  })

  useEffect(() => {
    // In a real app, you'd fetch this data from an API
    const mockReviews = [
      {
        id: 1,
        restaurantName: "Joe's Pizza",
        location: 'New York, NY',
        rating: 4,
        tags: ['pizza', 'italian'],
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        id: 2,
        restaurantName: "Mary's Tacos",
        location: 'Los Angeles, CA',
        rating: 5,
        tags: ['tacos', 'mexican'],
        latitude: 34.0522,
        longitude: -118.2437,
      },
      {
        id: 3,
        restaurantName: "Sushi Palace",
        location: 'San Francisco, CA',
        rating: 4,
        tags: ['sushi', 'japanese'],
        latitude: 37.7749,
        longitude: -122.4194,
      },
      {
        id: 4,
        restaurantName: "BBQ Heaven",
        location: 'Austin, TX',
        rating: 5,
        tags: ['bbq', 'american'],
        latitude: 30.2672,
        longitude: -97.7431,
      },
      {
        id: 5,
        restaurantName: "Pasta Paradise",
        location: 'Chicago, IL',
        rating: 4,
        tags: ['pasta', 'italian'],
        latitude: 41.8781,
        longitude: -87.6298,
      },
    ]
    setReviews(mockReviews)
  }, [])

  const handleReviewClick = useCallback((review) => {
    setSelectedReview(review)
    setViewState({
      longitude: review.longitude,
      latitude: review.latitude,
      zoom: 12,
    })
  }, [])

  return (
    <div className="flex h-[calc(100vh-8rem)]">
      <div className="w-3/4 h-full">
        <Map
          {...viewState}
          onMove={evt => setViewState(evt.viewState)}
          mapboxAccessToken={MAPBOX_TOKEN}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        >
          {reviews.map(review => (
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
      <div className="w-1/4 h-full overflow-y-auto bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Food Reviews</h2>
          <div className="space-y-4">
            {reviews.map(review => (
              <div
                key={review.id}
                className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleReviewClick(review)}
              >
                <h3 className="font-semibold">{review.restaurantName}</h3>
                <p className="text-sm text-gray-600">{review.location}</p>
                <p className="text-sm">Rating: {review.rating}/5</p>
                <p className="text-sm text-gray-500">{review.tags.join(', ')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}