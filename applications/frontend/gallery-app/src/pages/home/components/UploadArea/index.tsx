import { useRef } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";
import { useUploadImage } from "../../../../hooks/useUploadImage";

interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onUploadComplete?: () => void; // Callback to refresh gallery
}


const UploadArea = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadComplete,
}: UploadAreaProps) => {
  const { uploads, isUploading, uploadFiles } = useUploadImage();
  const fileInputRef = useRef<HTMLInputElement>(null);


  // Handle browse files click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      uploadFiles(e.target.files, onUploadComplete);
    }
  };

  // Enhanced drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragOver(e);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDragLeave(e);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(e);

    if (e.dataTransfer.files) {
      uploadFiles(e.dataTransfer.files, onUploadComplete);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative bg-white/5 backdrop-blur-sm rounded-2xl p-6 border-2 border-dashed transition-all duration-300 ${
          isDragging
            ? "border-purple-500 bg-purple-500/20"
            : "border-white/20 hover:border-purple-500/50"
        } ${isUploading ? "pointer-events-none opacity-75" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-white font-semibold mb-2">Upload Photos</h3>
          <p className="text-white/60 text-sm mb-4">
            Drag & drop images or zip files, or click to select
          </p>
          <button
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBrowseClick}
            disabled={isUploading}
          >
            {isUploading ? "Uploading..." : "Browse Files"}
          </button>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.zip"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-white text-sm truncate max-w-[200px]">
                  {upload.file.name}
                </span>
                <div className="flex items-center space-x-2">
                  {upload.status === "uploading" && (
                    <span className="text-blue-400 text-xs">
                      {upload.progress}%
                    </span>
                  )}
                  {upload.status === "completed" && (
                    <Check className="w-4 h-4 text-green-400" />
                  )}
                  {upload.status === "error" && (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    upload.status === "completed"
                      ? "bg-green-400"
                      : upload.status === "error"
                      ? "bg-red-400"
                      : "bg-blue-400"
                  }`}
                  style={{
                    width: `${
                      upload.status === "error" ? 100 : upload.progress
                    }%`,
                  }}
                />
              </div>

              {/* Error message */}
              {upload.status === "error" && upload.error && (
                <p className="text-red-400 text-xs mt-1">{upload.error}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UploadArea;
