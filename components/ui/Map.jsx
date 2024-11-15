"use client";

import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function Map({ reviews }) {
  const mapContainer = useRef(null);
  const map = useRef(null);

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

  return (
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
  );
} 