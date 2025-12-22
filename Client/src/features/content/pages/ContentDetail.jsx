import { useParams, useNavigate } from "react-router-dom";
import { useContentDetail } from "../hooks/useContentDetail";
import ContentRow from "../../../components/common/Row";

export default function ContentDetail() {
  const { id } = useParams();
  console.log("🔥 ContentDetail mounted");
console.log("🆔 useParams id:", id);

  const navigate = useNavigate();

  const {
    content,
    similar,
    loading,
    error,
  } = useContentDetail(id);

  if (loading) {
    return (
      <div className="text-white p-8">
        Loading...
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="text-white p-8">
        Content not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* HERO SECTION */}
      <div
        className="relative h-[70vh] bg-cover bg-center"
        style={{
          backgroundImage: `url(${content.thumbnail})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute bottom-10 left-10 max-w-xl">
          <h1 className="text-4xl font-bold mb-4">
            {content.title}
          </h1>

          <p className="text-gray-300 mb-6">
            {content.description}
          </p>

          <div className="flex gap-4">
            {/* PLAY */}
            <button
              onClick={() => navigate(`/player/${content.id}`)}
              className="bg-white text-black px-6 py-3 rounded font-semibold hover:bg-gray-300"
            >
              ▶ Play
            </button>

            {/* MY LIST (later) */}
            <button className="bg-gray-700 px-6 py-3 rounded">
              + My List
            </button>
          </div>
        </div>
      </div>

      {/* SIMILAR CONTENT */}
      {similar.length > 0 && (
        <div className="mt-8">
          <ContentRow
  title="More Like This"
  data={similar}
  isLoading={false}
/>

        </div>
      )}
    </div>
  );
}
