import ImageGrid from "./components/GridView";
import ImageList from "./components/ListView";
import { Image, ViewMode } from "../../../../types";

interface ImagesViewProps {
  images: Image[];
  selectedImages: number[];
  onImageSelect: (id: number) => void;
  onImageClick: (image: Image) => void;
  currentView: ViewMode;
}

const ImagesView = ({
  currentView,
  onImageClick,
  images,
  selectedImages,
  onImageSelect,
}: ImagesViewProps) => {
  if (currentView === "grid") {
    return (
      <ImageGrid
        images={images}
        selectedImages={selectedImages}
        onImageSelect={onImageSelect}
        onImageClick={onImageClick}
      />
    );
  } else if (currentView === "list") {
    return (
      <ImageList
        images={images}
        selectedImages={selectedImages}
        onImageSelect={onImageSelect}
        onImageClick={onImageClick}
      />
    );
  }
  return null;
};

export default ImagesView;
