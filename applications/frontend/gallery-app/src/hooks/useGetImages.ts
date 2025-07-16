import { useState, useEffect } from "react";
import { env } from "../config/env";
import { Image } from "../types";

interface ApiImage {
  PK: string;
  image_id: string;
  SK: string;
  image_url: string;
  image_description: string;
}

export const useGetImages = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const transformApiImages = (apiImages: ApiImage[]): Image[] => {
    return apiImages.map((apiImage, index) => ({
      id: index + 1,
      src: apiImage.image_url,
      title: apiImage.image_description || `Image ${index + 1}`,
      category: "nature",
      date: new Date().toISOString().split("T")[0],
      size: "Unknown",
      liked: false,
    }));
  };

  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = sessionStorage.getItem("idToken");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`${env.api.baseUrl}/v1/user/files`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiImages: ApiImage[] = await response.json();
      const transformedImages = transformApiImages(apiImages);
      setImages(transformedImages);
    } catch (err) {
      console.error("Error fetching images:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch images");
      // Fallback to mock data for demo
      setImages([
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
          title: "Mountain Sunset",
          category: "landscape",
          date: "2025-06-10",
          size: "2.4 MB",
          liked: true,
        },
        {
          id: 2,
          src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
          title: "Ocean Waves",
          category: "nature",
          date: "2025-06-09",
          size: "1.8 MB",
          liked: false,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch images on hook initialization
  useEffect(() => {
    fetchImages();
  }, []);

  const refetch = () => {
    fetchImages();
  };

  return {
    images,
    loading,
    error,
    refetch,
  };
};
