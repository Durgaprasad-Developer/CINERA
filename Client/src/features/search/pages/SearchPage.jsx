import ContentCard from "../../../components/common/ContentCard";
import { useSearch } from "../hooks/useSearch";
import { Search } from "lucide-react";

export default function SearchPage() {
  const { query, setQuery, results } = useSearch();

  return (
    <div className="min-h-screen pt-20 px-6 sm:px-10 pb-20" style={{ background: "#0D0D0F" }}>
      <div className="max-w-4xl mx-auto">
        {/* Search input */}
        <div className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6B6B7B]" />
          <input
            type="text"
            placeholder="Search titles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full pl-12 pr-5 py-4 text-lg bg-[#1A1A1D] border border-white/[0.08] text-white placeholder-[#6B6B7B] rounded-2xl outline-none focus:border-white/25 transition-colors"
          />
        </div>

        {/* Results */}
        {query.length > 1 && results.data?.results && (
          <div>
            {results.isLoading ? (
              <div className="text-center text-[#6B6B7B] py-16">Searching...</div>
            ) : results.data.results.length === 0 ? (
              <div className="text-center py-16 space-y-2">
                <p className="text-white font-medium">No results for "{query}"</p>
                <p className="text-sm text-[#6B6B7B]">Try different keywords.</p>
              </div>
            ) : (
              <>
                <p className="text-xs text-[#6B6B7B] uppercase tracking-widest mb-6 font-medium">
                  Results for "{query}"
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-8">
                  {results.data.results.map((item) => (
                    <ContentCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
