"use client";

import { useState } from "react";
import { AddressAutofill } from "@mapbox/search-js-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Asegúrate de reemplazar 'TU_TOKEN_DE_MAPBOX' con tu token real de Mapbox
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export default function LocationAutocomplete({ onLocationChange }) {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);

  const handleAddressChange = async (value) => {
    setAddress(value);

    // Llamar a la API de geocodificación para obtener las coordenadas
    if (value) {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          value
        )}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        const coords = { lat, lng };
        setCoordinates(coords);

        // Pasar los resultados al padre
        if (onLocationChange) {
          onLocationChange({ address: value, coordinates: coords });
        }
      }
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="address">Ubicacion</Label>
      <AddressAutofill accessToken={MAPBOX_ACCESS_TOKEN}>
        <Input
          id="address"
          placeholder="Ingresa una ubicación"
          value={address}
          onChange={(e) => handleAddressChange(e.target.value)}
          autoComplete="address-line1"
        />
      </AddressAutofill>
    </div>
  );
}
