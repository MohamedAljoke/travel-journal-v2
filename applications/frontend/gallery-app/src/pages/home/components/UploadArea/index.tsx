import { useState, useRef } from "react";
import { Upload, X, Check, AlertCircle } from "lucide-react";

interface UploadAreaProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onUploadComplete?: () => void; // Callback to refresh gallery
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

const UploadArea = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onUploadComplete,
}: UploadAreaProps) => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get presigned URL from API
  const getPresignedUrl = async (
    objectKey: string,
    contentType: string
  ): Promise<string> => {
    const token = sessionStorage.getItem("idToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(
      "https://50j8fgincj.execute-api.us-east-1.amazonaws.com/stg/v1/get-upload-url",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          objectKey,
          contentType,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.status}`);
    }

    const data = await response.json();
    return data.uploadUrl;
  };

  // Upload file to S3 using presigned URL
  const uploadToS3 = async (
    file: File,
    uploadUrl: string,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type); // e.g., image/jpeg

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 204) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error occurred during file upload"));
      };

      xhr.send(file); // binary content
    });
  };
  // Generate object key for S3
  const generateObjectKey = (file: File): string => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    return `uploads/${timestamp}-${randomId}.${extension}`;
  };

  // Handle file upload process
  const handleFileUpload = async (files: FileList) => {
    if (!files.length) return;

    const validFiles = Array.from(files).filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

      if (!isImage) {
        alert(`${file.name} is not a valid image file`);
        return false;
      }

      if (!isValidSize) {
        alert(`${file.name} is too large. Maximum size is 10MB`);
        return false;
      }

      return true;
    });

    if (!validFiles.length) return;

    setIsUploading(true);

    // Initialize upload progress for all files
    const initialUploads: UploadProgress[] = validFiles.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploads(initialUploads);

    // Upload files concurrently
    const uploadPromises = validFiles.map(async (file, index) => {
      try {
        const objectKey = generateObjectKey(file);
        const contentType = file.type || "image/jpeg";

        // Get presigned URL
        const uploadUrl = await getPresignedUrl(objectKey, contentType);

        // Upload to S3
        await uploadToS3(file, uploadUrl, (progress) => {
          setUploads((prev) =>
            prev.map((upload, i) =>
              i === index ? { ...upload, progress } : upload
            )
          );
        });

        // Mark as completed
        setUploads((prev) =>
          prev.map((upload, i) =>
            i === index
              ? { ...upload, status: "completed", progress: 100 }
              : upload
          )
        );
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        setUploads((prev) =>
          prev.map((upload, i) =>
            i === index
              ? {
                  ...upload,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Upload failed",
                }
              : upload
          )
        );
      }
    });

    await Promise.allSettled(uploadPromises);
    setIsUploading(false);

    // Check if any uploads completed successfully
    const hasSuccessfulUploads = uploads.some(
      (upload) => upload.status === "completed"
    );
    if (hasSuccessfulUploads && onUploadComplete) {
      // Wait a moment for S3 consistency, then refresh gallery
      setTimeout(() => {
        onUploadComplete();
      }, 1000);
    }

    // Clear uploads after 3 seconds
    setTimeout(() => {
      setUploads([]);
    }, 3000);
  };

  // Handle browse files click
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFileUpload(e.target.files);
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
      handleFileUpload(e.dataTransfer.files);
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
            Drag & drop or click to select
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
          accept="image/*"
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
