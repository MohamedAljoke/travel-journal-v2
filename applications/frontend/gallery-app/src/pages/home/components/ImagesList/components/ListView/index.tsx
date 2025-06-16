import { Download, Eye, Share2 } from "lucide-react";
import { Image } from "../..";

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
export default ImageList;
