import {
  Download,
  Filter,
  Grid,
  List,
  Search,
  Share2,
  Trash2,
} from "lucide-react";

interface ControlsBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  currentView: "grid" | "list";
  onViewChange: (view: "grid" | "list") => void;
  selectedImagesCount: number;
  filteredImagesCount: number;
}

export default function FiltersBar({
  searchTerm,
  onSearchChange,
  currentView,
  onViewChange,
  selectedImagesCount,
  filteredImagesCount,
}: ControlsBarProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 text-white/60 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={onSearchChange}
              className="bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-white/60 focus:outline-none focus:border-purple-500"
            />
          </div>
          <button
            className="p-2 text-white/60 hover:text-white transition-colors"
            onClick={() => console.log("Filter clicked")}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-white/60 text-sm">
            {filteredImagesCount} photos
          </span>
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => onViewChange("grid")}
              className={`p-2 rounded transition-all ${
                currentView === "grid"
                  ? "bg-purple-500 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewChange("list")}
              className={`p-2 rounded transition-all ${
                currentView === "list"
                  ? "bg-purple-500 text-white"
                  : "text-white/60 hover:text-white"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {selectedImagesCount > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/80 text-sm">
              {selectedImagesCount} selected
            </span>
            <div className="flex space-x-2">
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
                onClick={() => console.log("Share clicked")}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </button>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
                onClick={() => console.log("Download clicked")}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center"
                onClick={() => console.log("Delete clicked")}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
