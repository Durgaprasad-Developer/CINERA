import { useQuery } from "@tanstack/react-query";
import { searchContent } from "../api/searchApi";
import { useState } from "react";
import { useDebounce } from "../../../lib/hooks/useDebounce";

export function useSearch() {
  const [query, setQuery] = useState("");

  // 🔑 debounce user input
  const debouncedQuery = useDebounce(query, 500);

  const searchQuery = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchContent(debouncedQuery),
    enabled: debouncedQuery.length > 1,
    keepPreviousData: true,
  });

  return {
    query,
    setQuery,
    results: searchQuery,
  };
}
