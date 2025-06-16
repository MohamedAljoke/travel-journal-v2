import { Eye } from "lucide-react";
import { ImageGridProps } from "../../../../../../types";

const ImageGrid = ({
  images,
  selectedImages,
  onImageSelect,
  onImageClick,
}: ImageGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((image) => (
        <div
          key={image.id}
          className="relative group aspect-square rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10"
        >
          <img
            src={image.src}
            alt={image.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              onClick={() => onImageClick(image)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <Eye className="w-5 h-5 text-white" />
            </button>
          </div>
          <input
            type="checkbox"
            checked={selectedImages.includes(image.id)}
            onChange={() => onImageSelect(image.id)}
            className="absolute top-2 left-2 w-5 h-5 rounded border-2 border-white/50 checked:bg-blue-500 checked:border-blue-500"
          />
        </div>
      ))}
    </div>
  );
};

export default ImageGrid;
