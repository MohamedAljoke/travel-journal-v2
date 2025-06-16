import { Heart, Share2, Trash2 } from "lucide-react";

const QuickActions = () => (
  <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
    <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
    <div className="space-y-2">
      <button
        className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center"
        onClick={() => console.log("Favorites clicked")}
      >
        <Heart className="w-4 h-4 mr-3" />
        Favorites
      </button>
      <button
        className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center"
        onClick={() => console.log("Shared Albums clicked")}
      >
        <Share2 className="w-4 h-4 mr-3" />
        Shared Albums
      </button>
      <button
        className="w-full text-left px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex items-center"
        onClick={() => console.log("Recently Deleted clicked")}
      >
        <Trash2 className="w-4 h-4 mr-3" />
        Recently Deleted
      </button>
    </div>
  </div>
);
export default QuickActions;
