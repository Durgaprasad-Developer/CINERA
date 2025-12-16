import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ContentCard({ item }) {
  const navigate = useNavigate();

  // 🔐 SAFETY GUARD (MOST IMPORTANT)
  if (!item) return null;

  const thumbnailUrl = item.thumbnail
    ? item.thumbnail.startsWith("http")
      ? item.thumbnail
      : `https://cinera.onrender.com/${item.thumbnail}`
    : "/placeholder.png";

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.2 }}
      className="min-w-[160px] cursor-pointer"
      onClick={() => navigate(`/content/${item.id}`)}
    >
      <div className="rounded-lg overflow-hidden bg-gray-800">
        <img
          src={thumbnailUrl}
          alt={item.title || "Content"}
          className="h-48 w-full object-cover"
          onError={(e) => {
            e.target.src = "/placeholder.png";
          }}
        />
      </div>

      <p className="mt-2 text-sm text-gray-300 truncate">
        {item.title}
      </p>
    </motion.div>
  );
}
