import Row from "../../../components/common/Row";
import Hero from "../components/Hero";
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

  const heroContent =
    trending.data?.data?.data?.[0] || popular.data?.data?.data?.[0];
  const trendingContent = trending.data?.data?.data?.slice(1) || [];

  const favoritesList =
    favorites.data?.data?.favorites?.map((f) => ({
      id: f.content_id,
      ...f.content,
    })) || [];

  return (
    <div className="min-h-screen" style={{ background: "#0D0D0F" }}>
      {/* Hero */}
      <Hero content={heroContent} />

      {/* Rows — overlap hero bottom gradient */}
      <div className="relative z-10 -mt-20 space-y-10 pb-16">
        {favoritesList.length > 0 && (
          <Row title="My List" data={favoritesList} isLoading={favorites.isLoading} />
        )}
        <Row
          title="Continue Watching"
          data={continueWatching.data?.data?.data}
          isLoading={continueWatching.isLoading}
        />
        <Row
          title="Trending Now"
          data={trendingContent}
          isLoading={trending.isLoading}
        />
        <Row
          title="Popular on CINERA"
          data={popular.data?.data?.data}
          isLoading={popular.isLoading}
        />
        <Row
          title="Recently Added"
          data={recent.data?.data?.data}
          isLoading={recent.isLoading}
        />
        <Row
          title="Because You Watched"
          data={becauseYouWatched.data?.data?.data}
          isLoading={becauseYouWatched.isLoading}
        />
        <Row
          title="Recommended for You"
          data={recommended.data?.data?.data}
          isLoading={recommended.isLoading}
        />
      </div>
    </div>
  );
}
