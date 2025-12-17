import Row from "../../../components/common/Row";
import { useSearch } from "../hooks/useSearch";

export default function SearchPage() {
  const { query, setQuery, results } = useSearch();

  console.log("SearchPage Rendered with result:", results.data?.results);

  return (
    <div className="px-6 pt-6">
      <input
        type="text"
        placeholder="Search movies, shows..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full max-w-xl mb-8 px-4 py-3 rounded-md bg-gray-800 text-white outline-none"
      />

      {query.length > 1 && (
        <Row
  title={`Results for "${query}"`}
  data={results.data?.results}
  isLoading={results.isLoading}
/>

      )}
    </div>
  );
}
