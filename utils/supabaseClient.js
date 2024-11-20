// utils/supabaseClient.js
import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://nkzqbjrebxcanekilmfp.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export async function getRestaurants() {
  const { data, error } = await supabase.from("Restaurant").select("*");
  if (error) {
    console.error("error", error);
  } else {
    // console.log('data', data)
  }
  return data;
}

export async function getRestaurant(id) {
  const { data, error } = await supabase
    .from("Restaurant")
    .select("*")
    .eq("id", id);
  if (error) {
    console.error("error", error);
  } else {
    // console.log('res.id', data)
  }
  return data[0];
}

export async function pushRestaurant(restaurant) {
  const { data, error } = await supabase
    .from("Restaurant")
    .insert(restaurant)
    .select();
  if (error) throw Error(error.message);
  return data[0];
}

export async function getReseñas() {
  const { data, error } = await supabase.from("Reseña").select("*");
  if (error) {
    console.error("error", error);
  } else {
    // console.log('data', data)
  }
  return data;
}

export async function getReseña(id) {
  const { data, error } = await supabase
    .from("Reseña")
    .select("*")
    .eq("idres", id);
  if (error) {
    console.error("error", error);
  } else {
    // console.log('res.id', data)
  }
  return data;
}

export async function pushReseñas(reseña) {
  const { data, error } = await supabase.from("Reseña").insert(reseña).select();
  if (error) throw Error(error.message);
  return data[0];
}




export async function uploadFile(file, bucket, filePath) {
  if (!file) {
    return { publicUrl: null, error: "No se proporcionó un archivo." };
  }

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false, // Evita sobrescribir archivos existentes
    });


  if (error) {
    console.error("Error al subir el archivo:", error.message);
    return { error: error.message };
  }

  return { error: null };
}

export async function getUrl(bucket, filePath, expiry = 60000000) {
    if (!bucket || !filePath) {
      return { signedUrl: null, error: 'El bucket o la ruta del archivo no fueron proporcionados.' };
    }
  
    const { data, error } = await supabase
      .storage
      .from(bucket)
      .createSignedUrl(filePath, expiry);
  
    if (error) {
      console.error('Error al obtener la signed URL:', error.message);
      return { signedUrl: null, error: error.message };
    }
  
    return { signedUrl: data.signedUrl, error: null };
  }