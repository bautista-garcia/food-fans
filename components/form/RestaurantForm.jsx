"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { pushRestaurant, uploadFile, getUrl } from '@/utils/supabaseClient';
import ImageUploader from '@/components/form/ImageUploader';
import LocationAutocomplete from './LocationAutocomplete';
import { useToast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';

export default function RestaurantForm({ restauranteInicial = {} }){
  const [restaurante, setRestaurante] = useState({
    nombre: restauranteInicial.nombre || '',
    tags: restauranteInicial.tags ? restauranteInicial.tags.join(', ') : '',
    ubicacion: restauranteInicial.ubicacion || '',
    lat: restauranteInicial.lat || '',
    lng: restauranteInicial.lng || '',
    menu: restauranteInicial.menu || ''
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationData, setLocationData] = useState({
    address: '',
    coordinates: null,
  });
  const [errors, setErrors] = useState({});
  const { toast } = useToast();
  const router = useRouter();

  const handleLocationChange = (data) => {
    setLocationData(data);
    setErrors(prev => ({ ...prev, ubicacion: '' }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRestaurante(prevState => ({
      ...prevState,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setErrors(prev => ({ ...prev, foto: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!restaurante.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!locationData.address) newErrors.ubicacion = 'La ubicación es requerida';
    if (!file) newErrors.foto = 'La foto es requerida';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    try {
      let fotoUrl = '';
      if (file) {
        const bucketName = 'ff-images';
        const filePath = `restaurantes/${Date.now()}_${file.name}`;
        const { error } = await uploadFile(file, bucketName, filePath);
        if (error) throw error;

        const { signedUrl, errorurl } = await getUrl(bucketName, filePath);
        if (errorurl) throw errorurl;
        fotoUrl = signedUrl;
      }

      const tags = restaurante.tags.split(',').map(tag => tag.trim());
      const newRestaurante = {
        ...restaurante,
        ubicacion: locationData.address,
        lat: locationData.coordinates.lat,
        lng: locationData.coordinates.lng,
        tags,
        foto: fotoUrl
      };

      const { error } = await pushRestaurant(newRestaurante);
      if (error) {
        throw error;
      }

      // Limpiar el formulario si todo está bien
      setRestaurante({
        nombre: '',
        tags: '',
        ubicacion: '',
        lat: '',
        lng: '',
        menu: ''
      });
      setFile(null);
      setLocationData({ address: '', coordinates: null });

      toast({
        title: "Éxito",
        description: "El restaurante se ha guardado correctamente.",
      });

      router.push("/")


    } catch (error) {
      console.error('Error al guardar el restaurante:', error);
      if (error.message.includes('duplicate key value violates unique constraint')) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ya existe un restaurante con esa ubicación o nombre.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Ocurrió un error al guardar el restaurante. Por favor, inténtalo de nuevo.",
        });
      }
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
            {errors.nombre && <p className="text-sm text-red-500">{errors.nombre}</p>}
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
            <LocationAutocomplete
              onLocationChange={handleLocationChange}
            />
            {errors.ubicacion && <p className="text-sm text-red-500">{errors.ubicacion}</p>}
          </div>

          <div className="space-y-2">
            <Label>Foto</Label>
            <ImageUploader onFileSelect={handleFileSelect} />
            {errors.foto && <p className="text-sm text-red-500">{errors.foto}</p>}
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