import { Play, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero({ content }) {
  const navigate = useNavigate();

  if (!content) {
    return (
      <div className="h-[70vh] w-full bg-[#1A1A1D] animate-pulse" />
    );
  }

  const bgImage = content.thumbnail
    ? `https://mxyupktvetbubpufsjli.supabase.co/storage/v1/object/public/${content.thumbnail}`
    : null;

  return (
    <div className="relative h-[70vh] w-full overflow-hidden">
      {/* Backdrop */}
      {bgImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center scale-[1.02]"
          style={{ backgroundImage: `url('${bgImage}')` }}
        />
      ) : (
        <div className="absolute inset-0 bg-[#1A1A1D]" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0F]/90 via-[#0D0D0F]/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-[14%] left-6 sm:left-10 max-w-xl z-10 space-y-5 px-2">
        {/* Category tag */}
        {content.genre && (
          <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#A8A8B3] border border-white/20 px-3 py-1 rounded-full">
            {content.genre}
          </span>
        )}

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.05] tracking-tight">
          {content.title}
        </h1>

        {/* Description */}
        <p className="text-sm sm:text-base text-[#A8A8B3] leading-relaxed line-clamp-3 max-w-md">
          {content.description || "Experience a new kind of cinema. Stream it now on CINERA."}
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={() => navigate(`/player/${content.id}`)}
            className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all duration-150"
          >
            <Play className="w-4 h-4 fill-black" />
            Play
          </button>
          <button
            onClick={() => navigate(`/content/${content.id}`)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm px-6 py-2.5 rounded-lg backdrop-blur-sm active:scale-[0.98] transition-all duration-150"
          >
            <Info className="w-4 h-4" />
            More Info
          </button>
        </div>
      </div>
    </div>
  );
}
