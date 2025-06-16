import { Camera } from "lucide-react";

type Params = {
  searchTerm: string;
};
export default function EmptyState({ searchTerm }: Params) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <Camera className="w-8 h-8 text-white/60" />
      </div>
      <h3 className="text-white text-lg font-medium mb-2">No photos found</h3>
      <p className="text-white/60">
        {searchTerm
          ? "Try adjusting your search terms"
          : "Upload your first photo to get started"}
      </p>
    </div>
  );
}
