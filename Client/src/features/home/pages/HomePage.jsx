import Row from "../../../components/common/Row";
import { useHomeData } from "../hooks/useHomeData";
import { useFavorites } from "../../favorites/hooks/useFavorites";

export default function HomePage() {
  const {
    trending,
    popular,
    recent,
    continueWatching,
    recommended,
    becauseYouWatched,
  } = useHomeData();

  const { favorites } = useFavorites();

  return (
    <div className="pb-10">
      {/* My List */}
      {favorites.data?.data?.data?.length > 0 && (
        <Row
          title="My List"
          data={favorites.data.data.data}
          isLoading={favorites.isLoading}
        />
      )}

      {/* Continue Watching */}
      <Row
        title="Continue Watching"
        data={continueWatching.data?.data?.data}
        isLoading={continueWatching.isLoading}
      />

      {/* Trending */}
      <Row
        title="Trending Now"
        data={trending.data?.data?.data}
        isLoading={trending.isLoading}
      />

      {/* Popular */}
      <Row
        title="Popular on CINERA"
        data={popular.data?.data?.data}
        isLoading={popular.isLoading}
      />

      {/* Recently Added */}
      <Row
        title="Recently Added"
        data={recent.data?.data?.data}
        isLoading={recent.isLoading}
      />

      {/* Because You Watched */}
      <Row
        title="Because You Watched"
        data={becauseYouWatched.data?.data?.data}
        isLoading={becauseYouWatched.isLoading}
      />

      {/* Recommended */}
      <Row
        title="Recommended for You"
        data={recommended.data?.data?.data}
        isLoading={recommended.isLoading}
      />
    </div>
  );
}
