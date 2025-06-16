import { Download, Heart, Share2, X } from "lucide-react";
import { Image } from "../ImagesList";

interface LightboxProps {
  image: Image;
  onClose: () => void;
}
export default function LightBox({ image, onClose }: LightboxProps) {
  return (
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
          <h3 className="text-white text-xl font-semibold mb-2">
            {image.title}
          </h3>
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
}
