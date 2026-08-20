import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Play, Plus, Check } from "lucide-react";
import { useFavorites } from "../../features/favorites/hooks/useFavorites";

export default function ContentCard({ item }) {
  const navigate = useNavigate();
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  if (!item) return null;

  const favoritesList = favorites?.data?.data?.favorites || [];
  const isFavorited = favoritesList.some((f) => f.content_id === item.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    if (isFavorited) {
      removeFavorite.mutate(item.id);
    } else {
      addFavorite.mutate(item.id);
    }
  };

  const thumbnailUrl = item.thumbnail
    ? `https://mxyupktvetbubpufsjli.supabase.co/storage/v1/object/public/${item.thumbnail}`
    : "/placeholder.png";

  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative flex-none w-[150px] sm:w-[185px] aspect-[2/3] cursor-pointer select-none rounded-xl overflow-hidden bg-[#1A1A1D] group"
      onClick={() => navigate(`/content/${item.id}`)}
    >
      {/* Poster */}
      <img
        src={thumbnailUrl}
        alt={item.title || "Content"}
        className="w-full h-full object-cover"
        onError={(e) => {
          e.target.src =
            "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=800&auto=format&fit=crop";
        }}
      />

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
        <p className="text-white font-semibold text-sm leading-tight truncate mb-2">
          {item.title}
        </p>
        <div className="flex items-center gap-2">
          {/* Play */}
          <button
            className="flex items-center justify-center w-7 h-7 rounded-full bg-white hover:bg-white/90 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/player/${item.id}`);
            }}
          >
            <Play className="w-3 h-3 fill-black text-black ml-0.5" />
          </button>
          {/* Favorite */}
          <button
            className="flex items-center justify-center w-7 h-7 rounded-full border border-white/40 hover:border-white bg-transparent hover:bg-white/10 transition-all"
            onClick={handleFavoriteClick}
            title={isFavorited ? "Remove from My List" : "Add to My List"}
          >
            {isFavorited ? (
              <Check className="w-3.5 h-3.5 text-white" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Subtle border always visible */}
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.06] pointer-events-none" />
    </motion.div>
  );
}
