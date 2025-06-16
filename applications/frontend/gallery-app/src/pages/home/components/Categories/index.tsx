import { FolderPlus } from "lucide-react";

export interface CategoryType {
  value: string;
  label: string;
  count: number;
}
interface CategoriesProps {
  categories: CategoryType[];
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

export default function Categories({
  categories,
  selectedCategory,
  onCategorySelect,
}: CategoriesProps) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-white font-semibold mb-4 flex items-center">
        <FolderPlus className="w-5 h-5 mr-2" />
        Categories
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategorySelect(category.value)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
              selectedCategory === category.value
                ? "bg-purple-500/30 text-white"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{category.label}</span>
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                {category.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
