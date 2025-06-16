import ImageGrid from "./components/GridView";
import ImageList from "./components/ListView";

export interface Image {
  id: number;
  src: string;
  title: string;
  category: string;
  date: string;
  size: string;
  liked: boolean;
}
type Params = {
  images: Image[];
  selectedImages: number[];
  onImageSelect: (id: number) => void;
  onImageClick: (image: Image) => void;
  currentView: "grid" | "list";
};

const ImagesView = ({
  currentView,
  onImageClick,
  images,
  selectedImages,
  onImageSelect,
}: Params) => {
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
};

export default ImagesView;
