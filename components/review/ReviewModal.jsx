"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ImageUploader from "@/components/form/ImageUploader";
import { uploadFile, getUrl, pushReseñas } from "@/utils/supabaseClient";

export default function ReviewModal({ idres }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState({
    plato: "",
    descripcion: "",
    rating: 0,
  });
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setReview((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleRatingChange = (value) => {
    setReview((prevState) => ({
      ...prevState,
      rating: value,
    }));
  };

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!session)
        throw new Error("Debes iniciar sesión para enviar una reseña.");

      let fotoUrl = "";
      if (file) {
        const bucketName = "ff-images";
        const filePath = `resena/${Date.now()}_${file.name}`;
        const { error: uploadError } = await uploadFile(
          file,
          bucketName,
          filePath
        );
        if (uploadError) throw uploadError;

        const { signedUrl, error: urlError } = await getUrl(
          bucketName,
          filePath
        );
        if (urlError) throw urlError;
        fotoUrl = signedUrl;
      }

      const newReview = {
        ...review,
        usuario: session.user.name,
        foto: fotoUrl,
        idres,
      };

      await pushReseñas(newReview);

      setReview({
        plato: "",
        descripcion: "",
        rating: 0,
      });
      setFile(null);
      setIsOpen(false);
    } catch (error) {
      console.error("Error al guardar la reseña:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Agregar Reseña</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Agregar Reseña</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plato">Nombre del Plato</Label>
            <Input
              id="plato"
              name="plato"
              value={review.plato}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              value={review.descripcion}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rating">Rating</Label>
            <Input
              id="rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={review.rating}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label>Foto del Plato</Label>
            <ImageUploader onFileSelect={handleFileSelect} />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar Reseña"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}