import { Eye } from "lucide-react";
import { Image } from "../..";

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
export default ImageGrid;
