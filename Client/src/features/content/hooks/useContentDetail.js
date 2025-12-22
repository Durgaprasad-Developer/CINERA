import { useQuery } from "@tanstack/react-query";
import {
  getContentById,
  getSimilarContent,
} from "../api/contentApi";

export const useContentDetail = (contentId) => {
  const contentQuery = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => getContentById(contentId),
    enabled: !!contentId,
  });

  const similarQuery = useQuery({
    queryKey: ["similar-content", contentId],
    queryFn: () => getSimilarContent(contentId),
    enabled: !!contentId,
  });

  console.log("🎞 Similar data:", similarQuery.data);


  return {
    content: contentQuery.data,
    similar: similarQuery.data || [],
    loading: contentQuery.isLoading || similarQuery.isLoading,
    error: contentQuery.isError || similarQuery.isError,
  };
};
