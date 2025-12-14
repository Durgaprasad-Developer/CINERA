import { useQuery } from "@tanstack/react-query";
import {
  getTrending,
  getPopular,
  getRecent,
  getContinueWatching,
  getRecommendations,
  getBecauseYouWatched,
} from "../api/homeApi";

export function useHomeData() {
  const trending = useQuery({
    queryKey: ["trending"],
    queryFn: getTrending,
  });

  const popular = useQuery({
    queryKey: ["popular"],
    queryFn: getPopular,
  });

  const recent = useQuery({
    queryKey: ["recent"],
    queryFn: getRecent,
  });

  const continueWatching = useQuery({
    queryKey: ["continueWatching"],
    queryFn: getContinueWatching,
  });

  const recommended = useQuery({
    queryKey: ["recommended"],
    queryFn: getRecommendations,
  });

  const becauseYouWatched = useQuery({
    queryKey: ["because"],
    queryFn: getBecauseYouWatched,
  });

  return {
    trending,
    popular,
    recent,
    continueWatching,
    recommended,
    becauseYouWatched,
  };
}
