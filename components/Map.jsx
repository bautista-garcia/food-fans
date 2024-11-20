"use client";

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ reviews }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-57.9545, -34.9205],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
  }, []);

  // Handle markers updates when reviews change
  useEffect(() => {
    if (!map.current || !reviews) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    reviews.forEach(review => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.backgroundImage = 'url(https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png)';
      el.style.backgroundSize = 'cover';
      el.style.cursor = 'pointer';

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-bold">${review.restaurantName}</h3>
          <p class="text-sm">${review.location}</p>
          <p class="text-sm">Rating: ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</p>
          <p class="text-sm">${review.tags.join(', ')}</p>
        </div>
      `);

      // Create and add marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([
          Math.max(Math.min(review.lng, 90), -90), 
          Math.max(Math.min(review.lat, 90), -90)
        ])
        .setPopup(popup)
        .addTo(map.current);

      markers.current.push(marker);
    });
  }, [reviews]);

  return (
    <>
      <div
        ref={mapContainer}
        className="fixed inset-0"
        style={{
          position: 'fixed',
          width: '100vw',
          height: '100vh',
          zIndex: 0
        }}
      />
      <style jsx global>{`
        .mapboxgl-popup-content {
          padding: 0;
          border-radius: 8px;
        }
        .marker {
          transition: transform 0.2s;
        }
        .marker:hover {
          transform: scale(1.2);
        }
      `}</style>
    </>
  );
} 