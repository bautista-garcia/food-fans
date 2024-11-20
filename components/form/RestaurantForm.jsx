"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { pushRestaurant, uploadFile, getUrl } from '@/utils/supabaseClient';
import ImageUploader from '@/components/form/ImageUploader';
import LocationAutocomplete from './LocationAutocomplete';

export default function RestaurantForm({ restauranteInicial = {} }){
  const [restaurante, setRestaurante] = useState({
    nombre: restauranteInicial.nombre || '',
    tags: restauranteInicial.tags ? restauranteInicial.tags.join(', ') : '',
    ubicacion: restauranteInicial.ubicacion || '',
    lat: restauranteInicial.lat || '',
    lng: restauranteInicial.lng || '',
    rating: restauranteInicial.rating || '',
    menu: restauranteInicial.menu || ''
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationData, setLocationData] = useState({
    address: '',
    coordinates: null,
  })

  const handleLocationChange = (data) => {
    setLocationData(data)
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurante(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Subimos imagen y obtenemos URL del bucket
      let fotoUrl = '';
      if (file) {
        const bucketName = 'ff-images';
        const filePath = `restaurantes/${Date.now()}_${file.name}`;
        console.log('filePath', filePath, "bucketName", bucketName, "file", file);
        const { error } = await uploadFile(file, bucketName, filePath);
        if (error) throw error;

        const { signedUrl, errorurl } = await getUrl(bucketName, filePath);
        if (errorurl) throw errorurl;
        fotoUrl = signedUrl;

      }

      // Procesamos tags y agregamos URL
      const tags = restaurante.tags.split(',').map(tag => tag.trim());
      const newRestaurante = {
        ...restaurante,
        ubicacion: locationData.address,
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
        tags,
        foto: fotoUrl
      };

      // Subimos restaurant a DB
      console.log('newRestaurante', newRestaurante);
      await pushRestaurant(newRestaurante);


      // Limpiar el formulario o redirigir según sea necesario
      setRestaurante({
        nombre: '',
        tags: '',
        ubicacion: '',
        lat: '',
        lng: '',
        rating: '',
        menu: ''
      });
      setFile(null);

    } catch (error) {
      console.error('Error al guardar el restaurante:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Formulario de Restaurante</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              value={restaurante.nombre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separados por comas)</Label>
            <Input
              id="tags"
              name="tags"
              value={restaurante.tags}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <LocationAutocomplete
              onLocationChange={handleLocationChange}
            />
          </div>

          {/* <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lat">Latitud</Label>
              <Input
                id="lat"
                name="lat"
                type="number"
                value={restaurante.lat}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lng">Longitud</Label>
              <Input
                id="lng"
                name="lng"
                type="number"
                value={restaurante.lng}
                onChange={handleChange}
              />
            </div>
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={restaurante.rating}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Foto</Label>
            <ImageUploader onFileSelect={handleFileSelect} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="menu">URL del Menú</Label>
            <Input
              id="menu"
              name="menu"
              type="url"
              value={restaurante.menu}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

