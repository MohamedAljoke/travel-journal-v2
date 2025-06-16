// API Types
export interface ApiImage {
  PK: string;
  image_id: string;
  SK: string;
  image_url: string;
  image_description: string;
  created_at?: string;
  updated_at?: string;
  metadata?: ImageMetadata;
}

export interface ImageMetadata {
  size: number;
  width?: number;
  height?: number;
  format: string;
  tags?: string[];
}

// Component Types
export interface Image {
  id: number;
  src: string;
  title: string;
  category: string;
  date: string;
  size: string;
  liked: boolean;
  metadata?: ImageMetadata;
}

export interface CategoryType {
  value: string;
  label: string;
  count: number;
}

export type ViewMode = "grid" | "list";

// Auth Types
export interface AuthContextType {
  isAuthenticated: boolean;
  user?: string | null;
  login: (email: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  loading: boolean;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

// Upload Types
export interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onUploadComplete?: () => void;
}

// Component Props Types
export interface ImageGridProps {
  images: Image[];
  selectedImages: number[];
  onImageSelect: (id: number) => void;
  onImageClick: (image: Image) => void;
}

export interface ImageListProps extends ImageGridProps {}

export interface LightboxProps {
  image: Image;
  onClose: () => void;
}

export interface FiltersBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedImagesCount: number;
  filteredImagesCount: number;
}

export interface CategoriesProps {
  categories: CategoryType[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  status: number;
  message?: string;
} 