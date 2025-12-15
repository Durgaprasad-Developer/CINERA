import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Button from "../../../components/ui/Button";
import Row from "../../../components/common/Row";
import {
  getContentById,
  getSimilarContent,
} from "../api/contentApi";
import { useFavorites } from "../../favorites/hooks/useFavorites";


export default function ContentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["content", id],
    queryFn: () => getContentById(id),
  });

  const similar = useQuery({
    queryKey: ["similar", id],
    queryFn: () => getSimilarContent(id),
  });

  if (isLoading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  const content = data.data;

  const {
    likes,
    favorites,
    like,
    unlike,
    addFavorite,
    removeFavorite,
  } = useFavorites();

  const isLiked = likes.data?.data.some(
    (item) => item.id === content.id
  );

  const isFavorite = favorites.data?.data?.some(
    (item) => item.id === content.id
  )
  return (
    <div className="px-6 pb-10">
      {/* HERO */}
      <div className="flex flex-col md:flex-row gap-8 mt-6">
        <img
          src={content.thumbnail}
          alt={content.title}
          className="w-full md:w-72 rounded-xl"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">
            {content.title}
          </h1>

          <p className="text-gray-300 mb-6 max-w-2xl">
            {content.description}
          </p>

          <div className="flex gap-4">
  <Button onClick={() => navigate(`/player/${id}`)}>
    ▶ Play
  </Button>

  <Button
    variant="secondary"
    onClick={() =>
      isFavorite
        ? removeFavorite.mutate(id)
        : addFavorite.mutate(id)
    }
  >
    {isFavorite ? "✓ In My List" : "+ My List"}
  </Button>

  <Button
    variant="ghost"
    onClick={() =>
      isLiked
        ? unlike.mutate(id)
        : like.mutate(id)
    }
  >
    {isLiked ? "❤️ Liked" : "🤍 Like"}
  </Button>
</div>

        </div>
      </div>

      {/* SIMILAR */}
      <div className="mt-12">
        <Row
          title="More Like This"
          data={similar.data?.data}
          isLoading={similar.isLoading}
        />
      </div>
    </div>
  );
}
