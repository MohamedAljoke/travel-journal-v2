import { useState } from "react";
import {
  Camera,
  Upload,
  Share2,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Heart,
  Eye,
  X,
  FolderPlus,
  Settings,
  User,
  Bell,
} from "lucide-react";

// Types
interface Image {
  id: number;
  src: string;
  title: string;
  category: string;
  date: string;
  size: string;
  liked: boolean;
}

interface Category {
  value: string;
  label: string;
  count: number;
}

// Components
const Header = () => (
  <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              CloudGallery
            </span>
          </div>
          <span className="text-white/60 text-sm">My Gallery</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => console.log("Notifications clicked")}
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            className="p-2 text-white/80 hover:text-white transition-colors"
            onClick={() => console.log("Settings clicked")}
          >
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  </header>
);

interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
}

const UploadArea = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
}: UploadAreaProps) => (
  <div
    className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed transition-all duration-300 ${
      isDragging
        ? "border-purple-500 bg-purple-500/20"
        : "border-white/20 hover:border-purple-500/50"
    }`}
    onDragOver={onDragOver}
    onDragLeave={onDragLeave}
    onDrop={onDrop}
  >
    <div className="text-center">
      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Upload className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-white font-semibold mb-2">Upload Photos</h3>
      <p className="text-white/60 text-sm mb-4">
        Drag & drop or click to select
      </p>
      <button
        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all"
        onClick={() => console.log("Browse files clicked")}
      >
        Browse Files
      </button>
    </div>
  </div>
);

interface CategoriesProps {
  categories: Category[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const Categories = ({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoriesProps) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <h3 className="text-white font-semibold mb-4 flex items-center">
      <FolderPlus className="w-5 h-5 mr-2" />
      Categories
    </h3>
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category.value}
          onClick={() => onCategorySelect(category.value)}
          className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
            selectedCategory === category.value
              ? "bg-purple-500/30 text-white"
              : "text-white/70 hover:text-white hover:bg-white/10"
          }`}
        >
          <div className="flex justify-between items-center">
            <span>{category.label}</span>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {category.count}
            </span>
          </div>
        </button>
      ))}
    </div>
  </div>
);

const QuickActions = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
    <div className="space-y-2">
      <button
        className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center"
        onClick={() => console.log("Favorites clicked")}
      >
        <Heart className="w-4 h-4 mr-3" />
        Favorites
      </button>
      <button
        className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center"
        onClick={() => console.log("Shared Albums clicked")}
      >
        <Share2 className="w-4 h-4 mr-3" />
        Shared Albums
      </button>
      <button
        className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center"
        onClick={() => console.log("Recently Deleted clicked")}
      >
        <Trash2 className="w-4 h-4 mr-3" />
        Recently Deleted
      </button>
    </div>
  </div>
);

interface ControlsBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  selectedImagesCount: number;
  filteredImagesCount: number;
}

const ControlsBar = ({
  searchTerm,
  onSearchChange,
  currentView,
  onViewChange,
  selectedImagesCount,
  filteredImagesCount,
}: ControlsBarProps) => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search photos..."
            value={searchTerm}
            onChange={onSearchChange}
            className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-purple-500"
          />
        </div>
        <button
          className="p-2 text-white/60 hover:text-white transition-colors"
          onClick={() => console.log("Filter clicked")}
        >
          <Filter className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-white/60 text-sm">
          {filteredImagesCount} photos
        </span>
        <div className="flex bg-white/10 rounded-lg p-1">
          <button
            onClick={() => onViewChange("grid")}
            className={`p-2 rounded transition-all ${
              currentView === "grid"
                ? "bg-purple-500 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <Grid className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewChange("list")}
            className={`p-2 rounded transition-all ${
              currentView === "list"
                ? "bg-purple-500 text-white"
                : "text-white/60 hover:text-white"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    {selectedImagesCount > 0 && (
      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-white/80 text-sm">
            {selectedImagesCount} selected
          </span>
          <div className="flex space-x-2">
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
              onClick={() => console.log("Share clicked")}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
            <button
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
              onClick={() => console.log("Download clicked")}
            >
              <Download className="w-4 h-4 mr-1" />
              Download
            </button>
            <button
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
              onClick={() => console.log("Delete clicked")}
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

interface ImageGridProps {
  images: Image[];
  selectedImages: number[];
  onImageSelect: (id: number) => void;
  onImageClick: (image: Image) => void;
}

const ImageGrid = ({
  images,
  selectedImages,
  onImageSelect,
  onImageClick,
}: ImageGridProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {images.map((image) => (
      <div
        key={image.id}
        className={`group relative bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden border transition-all duration-300 hover:scale-105 ${
          selectedImages.includes(image.id)
            ? "border-purple-500 ring-2 ring-purple-500/50"
            : "border-white/10 hover:border-purple-500/50"
        }`}
      >
        <div className="aspect-square relative overflow-hidden">
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300">
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onImageSelect(image.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  selectedImages.includes(image.id)
                    ? "bg-purple-500 border-purple-500"
                    : "border-white/60 hover:border-white"
                }`}
              >
                {selectedImages.includes(image.id) && (
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                )}
              </button>
            </div>

            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onImageClick(image)}
                className="p-2 bg-black/60 rounded-lg text-white hover:bg-black/80 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-white font-medium truncate mb-1">
            {image.title}
          </h3>
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>{image.date}</span>
            <span>{image.size}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface ImageListProps {
  images: Image[];
  selectedImages: number[];
  onImageSelect: (id: number) => void;
  onImageClick: (image: Image) => void;
}

const ImageList = ({
  images,
  selectedImages,
  onImageSelect,
  onImageClick,
}: ImageListProps) => (
  <div className="space-y-2">
    {images.map((image) => (
      <div
        key={image.id}
        className={`flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-lg p-4 border transition-all ${
          selectedImages.includes(image.id)
            ? "border-purple-500 bg-purple-500/10"
            : "border-white/10 hover:border-purple-500/50"
        }`}
      >
        <button
          onClick={() => onImageSelect(image.id)}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            selectedImages.includes(image.id)
              ? "bg-purple-500 border-purple-500"
              : "border-white/60 hover:border-white"
          }`}
        >
          {selectedImages.includes(image.id) && (
            <div className="w-2 h-2 bg-white rounded-full"></div>
          )}
        </button>

        <img
          src={image.src}
          alt={image.title}
          className="w-16 h-16 object-cover rounded-lg"
        />

        <div className="flex-1">
          <h3 className="text-white font-medium">{image.title}</h3>
          <div className="flex items-center space-x-4 text-sm text-white/60 mt-1">
            <span>{image.category}</span>
            <span>{image.date}</span>
            <span>{image.size}</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => onImageClick(image)}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => console.log("Share clicked")}
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button
            className="p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => console.log("Download clicked")}
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    ))}
  </div>
);

interface LightboxProps {
  image: Image;
  onClose: () => void;
}

const Lightbox = ({ image, onClose }: LightboxProps) => (
  <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className="relative max-w-4xl max-h-full">
      <button
        onClick={onClose}
        className="absolute -top-12 right-0 text-white/80 hover:text-white transition-colors"
      >
        <X className="w-8 h-8" />
      </button>

      <img
        src={image.src}
        alt={image.title}
        className="max-w-full max-h-full object-contain rounded-lg"
      />

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
        <h3 className="text-white text-xl font-semibold mb-2">{image.title}</h3>
        <div className="flex items-center justify-between text-white/80">
          <div className="flex space-x-4 text-sm">
            <span>{image.category}</span>
            <span>{image.date}</span>
            <span>{image.size}</span>
          </div>
          <div className="flex space-x-2">
            <button
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              onClick={() => console.log("Like clicked")}
            >
              <Heart className="w-5 h-5" />
            </button>
            <button
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              onClick={() => console.log("Share clicked")}
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              onClick={() => console.log("Download clicked")}
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

interface EmptyStateProps {
  searchTerm: string;
}

const EmptyState = ({ searchTerm }: EmptyStateProps) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
      <Camera className="w-8 h-8 text-white/60" />
    </div>
    <h3 className="text-white text-lg font-medium mb-2">No photos found</h3>
    <p className="text-white/60">
      {searchTerm
        ? "Try adjusting your search terms"
        : "Upload your first photo to get started"}
    </p>
  </div>
);

const GalleryPage = () => {
  const [currentView, setCurrentView] = useState<"grid" | "list">("grid");
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [lightboxImage, setLightboxImage] = useState<Image | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Mock data for images
  const [images] = useState<Image[]>([
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
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop",
      title: "City Lights",
      category: "urban",
      date: "2025-06-08",
      size: "3.1 MB",
      liked: true,
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=300&fit=crop",
      title: "Forest Path",
      category: "nature",
      date: "2025-06-07",
      size: "2.7 MB",
      liked: false,
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      title: "Desert Dunes",
      category: "landscape",
      date: "2025-06-06",
      size: "2.2 MB",
      liked: true,
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=300&fit=crop",
      title: "Autumn Leaves",
      category: "nature",
      date: "2025-06-05",
      size: "1.9 MB",
      liked: false,
    },
  ]);

  const categories: Category[] = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <ControlsBar
              searchTerm={searchTerm}
              onSearchChange={(e) => setSearchTerm(e.target.value)}
              currentView={currentView}
              onViewChange={setCurrentView}
              selectedImagesCount={selectedImages.length}
              filteredImagesCount={filteredImages.length}
            />

            {filteredImages.length === 0 ? (
              <EmptyState searchTerm={searchTerm} />
            ) : currentView === "grid" ? (
              <ImageGrid
                images={filteredImages}
                selectedImages={selectedImages}
                onImageSelect={handleImageSelect}
                onImageClick={setLightboxImage}
              />
            ) : (
              <ImageList
                images={filteredImages}
                selectedImages={selectedImages}
                onImageSelect={handleImageSelect}
                onImageClick={setLightboxImage}
              />
            )}
          </div>
        </div>
      </div>

      {lightboxImage && (
        <Lightbox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </div>
  );
};

export default GalleryPage;
