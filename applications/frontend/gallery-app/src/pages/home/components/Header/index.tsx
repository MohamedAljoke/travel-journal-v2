import { Bell, Camera, Settings, User } from "lucide-react";
import React from "react";

export default function Header() {
  return (
    <header className="bg-black/20 backdrop-blur-lg border-b border-white/10 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Camera className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                CloudGallery
              </span>
            </div>
            <span className="text-white/60 text-sm">My Gallery</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              className="p-2 text-white/80 hover:text-white transition-colors"
              onClick={() => console.log("Notifications clicked")}
            >
              <Bell className="w-5 h-5" />
            </button>
            <button
              className="p-2 text-white/80 hover:text-white transition-colors"
              onClick={() => console.log("Settings clicked")}
            >
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
