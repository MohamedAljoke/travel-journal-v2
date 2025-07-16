import { useState } from "react";
import JSZip from "jszip";
import { env } from "../config/env";

export interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "completed" | "error";
  error?: string;
}

export const useUploadImage = () => {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const getPresignedUrl = async (
    objectKey: string,
    contentType: string
  ): Promise<string> => {
    const token = sessionStorage.getItem("idToken");

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await fetch(`${env.api.baseUrl}/v1/get-upload-url`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        objectKey,
        contentType,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get upload URL: ${response.status}`);
    }

    const data = await response.json();
    return data.uploadUrl;
  };

  const uploadToS3 = async (
    file: File,
    uploadUrl: string,
    onProgress: (progress: number) => void
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", uploadUrl, true);
      xhr.setRequestHeader("Content-Type", file.type || "image/jpeg");

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

      xhr.send(file);
    });
  };

  const generateObjectKey = (file: File): string => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
    return `uploads/${timestamp}-${randomId}.${extension}`;
  };

  const extractImagesFromZip = async (zipFile: File): Promise<File[]> => {
    try {
      const zip = await JSZip.loadAsync(zipFile);
      const imageFiles: File[] = [];

      for (const [filename, file] of Object.entries(zip.files)) {
        if (!file.dir) {
          const fileExtension = filename.split(".").pop()?.toLowerCase();
          const supportedExtensions = [
            "jpg",
            "jpeg",
            "png",
            "gif",
            "webp",
            "bmp",
          ];

          if (fileExtension && supportedExtensions.includes(fileExtension)) {
            const blob = await file.async("blob");
            const extractedFile = new File([blob], filename, {
              type: `image/${fileExtension === "jpg" ? "jpeg" : fileExtension}`,
            });

            if (extractedFile.size <= 10 * 1024 * 1024) {
              // 10MB limit
              imageFiles.push(extractedFile);
            }
          }
        }
      }

      return imageFiles;
    } catch (error) {
      console.error("Error extracting zip file:", error);
      throw new Error("Failed to extract zip file");
    }
  };

  const uploadFiles = async (
    files: FileList,
    onUploadComplete?: () => void
  ) => {
    if (!files.length) return;

    let allFilesToUpload: File[] = [];

    // Process each file - extract if zip, validate if image
    for (const file of Array.from(files)) {
      if (
        file.type === "application/zip" ||
        file.name.toLowerCase().endsWith(".zip")
      ) {
        try {
          const extractedImages = await extractImagesFromZip(file);
          allFilesToUpload.push(...extractedImages);
          if (extractedImages.length > 0) {
            alert(
              `Extracted ${extractedImages.length} images from ${file.name}`
            );
          } else {
            alert(`No valid images found in ${file.name}`);
          }
        } catch (error) {
          alert(
            `Failed to extract ${file.name}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`
          );
        }
      } else {
        const isImage = file.type.startsWith("image/");
        const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit

        if (!isImage) {
          alert(`${file.name} is not a valid image file`);
          continue;
        }

        if (!isValidSize) {
          alert(`${file.name} is too large. Maximum size is 10MB`);
          continue;
        }

        allFilesToUpload.push(file);
      }
    }

    if (!allFilesToUpload.length) return;

    setIsUploading(true);

    // Initialize upload progress for all files
    const initialUploads: UploadProgress[] = allFilesToUpload.map((file) => ({
      file,
      progress: 0,
      status: "uploading" as const,
    }));

    setUploads(initialUploads);

    // Upload files concurrently
    const uploadPromises = allFilesToUpload.map(async (file, index) => {
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

  const clearUploads = () => {
    setUploads([]);
  };

  return {
    uploads,
    isUploading,
    uploadFiles,
    clearUploads,
  };
};
