import { useParams, useNavigate } from "react-router-dom";
import { useContentDetail } from "../hooks/useContentDetail";
import ContentRow from "../../../components/common/Row";
import { Play, Plus, Check, ThumbsUp } from "lucide-react";
import { useFavorites } from "../../favorites/hooks/useFavorites";

export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { content, similar, loading, error } = useContentDetail(id);
  const { favorites, likes, addFavorite, removeFavorite, like, unlike } = useFavorites();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0D0D0F" }}>
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#0D0D0F" }}>
        <p className="text-[#A8A8B3]">Content not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const bgImage = content.thumbnail
    ? `https://mxyupktvetbubpufsjli.supabase.co/storage/v1/object/public/${content.thumbnail}`
    : null;

  const favoritesList = favorites?.data?.data?.favorites || [];
  const isFavorited = favoritesList.some((f) => f.content_id === content.id);
  const likesList = likes?.data?.data?.likes || [];
  const isLiked = likesList.some((l) => l.content_id === content.id);

  const toggleFavorite = () =>
    isFavorited ? removeFavorite.mutate(content.id) : addFavorite.mutate(content.id);
  const toggleLike = () =>
    isLiked ? unlike.mutate(content.id) : like.mutate(content.id);

  return (
    <div className="min-h-screen text-white" style={{ background: "#0D0D0F" }}>
      {/* Hero backdrop */}
      <div className="relative h-[75vh] w-full overflow-hidden">
        {bgImage ? (
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${bgImage})` }}
          />
        ) : (
          <div className="absolute inset-0 bg-[#1A1A1D]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0D0F]/90 via-[#0D0D0F]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0F] via-transparent to-transparent" />

        {/* Info */}
        <div className="absolute bottom-16 left-6 sm:left-12 max-w-2xl space-y-4 z-10">
          {content.genre && (
            <span className="inline-block text-xs font-semibold tracking-[0.12em] uppercase text-[#A8A8B3] border border-white/20 px-3 py-1 rounded-full">
              {content.genre}
            </span>
          )}

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight">
            {content.title}
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-3 text-sm text-[#A8A8B3]">
            {content.duration_seconds > 0 && (
              <span>{Math.floor(content.duration_seconds / 60)} min</span>
            )}
          </div>

          <p className="text-[#A8A8B3] leading-relaxed max-w-lg text-sm sm:text-base">
            {content.description || "Experience a new kind of cinema. Stream it now on CINERA."}
          </p>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/player/${content.id}`)}
              className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-7 py-3 rounded-lg hover:bg-white/90 active:scale-[0.98] transition-all duration-150"
            >
              <Play className="w-4 h-4 fill-black" />
              Play
            </button>

            <button
              onClick={toggleFavorite}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-white/30 hover:border-white hover:bg-white/10 transition-all"
              title={isFavorited ? "Remove from My List" : "Add to My List"}
            >
              {isFavorited ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Plus className="w-4 h-4 text-white" />
              )}
            </button>

            <button
              onClick={toggleLike}
              className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all ${
                isLiked
                  ? "border-white bg-white/10"
                  : "border-white/30 hover:border-white hover:bg-white/10"
              }`}
              title={isLiked ? "Unlike" : "Like"}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-white text-white" : "text-white"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* More Like This */}
      {similar?.length > 0 && (
        <div className="relative z-10 -mt-6 pb-14">
          <ContentRow title="More Like This" data={similar} isLoading={loading} />
        </div>
      )}
    </div>
  );
}
