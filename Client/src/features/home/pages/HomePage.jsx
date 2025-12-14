import Row from "../../../components/common/Row";
import { useHomeData } from "../hooks/useHomeData";

export default function HomePage() {
  const {
    trending,
    popular,
    recent,
    continueWatching,
    recommended,
    becauseYouWatched,
  } = useHomeData();

  return (
    <div className="pb-10">
      <Row
        title="Continue Watching"
        data={continueWatching.data?.data}
        isLoading={continueWatching.isLoading}
      />

      <Row
        title="Trending Now"
        data={trending.data?.data}
        isLoading={trending.isLoading}
      />

      <Row
        title="Popular on CINERA"
        data={popular.data?.data}
        isLoading={popular.isLoading}
      />

      <Row
        title="Recently Added"
        data={recent.data?.data}
        isLoading={recent.isLoading}
      />

      <Row
        title="Because You Watched"
        data={becauseYouWatched.data?.data}
        isLoading={becauseYouWatched.isLoading}
      />

      <Row
        title="Recommended for You"
        data={recommended.data?.data}
        isLoading={recommended.isLoading}
      />
    </div>
  );
}
