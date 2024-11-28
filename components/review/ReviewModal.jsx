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
import StarRating from "./StarRating";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ReviewModal({ idres, onReviewAdded }) {
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
  const router = useRouter();

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

      if (onReviewAdded) {
        onReviewAdded();
      }

      router.refresh();

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
        {session ? (
          <Button>Agregar Reseña</Button>
        ) : (
          <Link
            href="/login"
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300 bg-neutral-900 text-neutral-50 shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90 h-9 px-4 py-2"
          >
            Agregar Reseña
          </Link>
        )}
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
            <StarRating
              rating={review.rating}
              onRatingChange={handleRatingChange}
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
