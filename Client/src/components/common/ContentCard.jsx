import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function ContentCard({ item }) {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.2 }}
      className="min-w-[160px] cursor-pointer"
      onClick={() => navigate(`/content/${item.id}`)}
    >
      <div className="rounded-lg overflow-hidden bg-gray-800">
        <img
          src={item.thumbnail || "/placeholder.png"}
          alt={item.title}
          className="h-48 w-full object-cover"
        />
      </div>

      <p className="mt-2 text-sm text-gray-300 truncate">
        {item.title}
      </p>
    </motion.div>
  );
}
