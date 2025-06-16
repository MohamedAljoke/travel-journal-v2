import { useEffect, useState } from "react";
import EmptyState from "./components/EmptyState";
import Header from "./components/Header";
import QuickActions from "./components/Actions";
import UploadArea from "./components/UploadArea";
import ImagesView from "./components/ImagesList";
import Categories, { CategoryType } from "./components/Categories";
import LightBox from "./components/LightBoxImage";
import FiltersBar from "./components/FiltersBar";
import { Image } from "../../types";

interface ApiImage {
  PK: string;
  image_id: string;
  SK: string;
  image_url: string;
  image_description: string;
}

const GalleryPage = () => {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<Image | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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

  // Fetch images from API
  const fetchImages = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = sessionStorage.getItem("idToken");
      console.log(token);
      const response = await fetch(
        "https://50j8fgincj.execute-api.us-east-1.amazonaws.com/stg/v1/user/files",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

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

  // Fetch images on component mount
  useEffect(() => {
    fetchImages();
  }, []);

  const categories: CategoryType[] = [
    { value: "all", label: "All Photos", count: images.length },
    {
      value: "landscape",
      label: "Landscape",
      count: images.filter((img) => img.category === "landscape").length,
    },
    {
      value: "nature",
      label: "Nature",
      count: images.filter((img) => img.category === "nature").length,
    },
    {
      value: "urban",
      label: "Urban",
      count: images.filter((img) => img.category === "urban").length,
    },
  ];

  const filteredImages = images.filter((image) => {
    const matchesSearch = image.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || image.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleImageSelect = (imageId: number): void => {
    setSelectedImages((prev) =>
      prev.includes(imageId)
        ? prev.filter((id) => id !== imageId)
        : [...prev, imageId]
    );
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic would go here
    console.log("Files dropped");
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-white text-lg">Loading images...</div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && images.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col items-center justify-center h-64 text-white">
            <div className="text-lg mb-4">Error loading images</div>
            <div className="text-sm text-gray-300 mb-4">{error}</div>
            <button
              onClick={fetchImages}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-yellow-900/50 border border-yellow-600 rounded-lg text-yellow-200">
            <div className="flex items-center justify-between">
              <span>Warning: {error} (showing fallback data)</span>
              <button
                onClick={fetchImages}
                className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 rounded text-sm transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            <UploadArea
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
            <Categories
              categories={categories}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <QuickActions />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <FiltersBar
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              currentView={currentView}
              onViewChange={setCurrentView}
              selectedImagesCount={selectedImages.length}
              filteredImagesCount={filteredImages.length}
            />

            {filteredImages.length === 0 ? (
              <EmptyState searchTerm={searchTerm} />
            ) : (
              <ImagesView
                currentView={currentView}
                images={filteredImages}
                onImageSelect={handleImageSelect}
                onImageClick={setLightboxImage}
                selectedImages={selectedImages}
              />
            )}
          </div>
        </div>
      </div>
      {lightboxImage && (
        <LightBox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};

export default GalleryPage;
