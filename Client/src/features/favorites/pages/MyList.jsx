import Row from "../../../components/common/Row";
import { useFavorites } from "../hooks/useFavorites";

export default function MyList() {
  const { favorites } = useFavorites();

  const favoritesList =
    favorites.data?.data?.favorites?.map((f) => ({
      id: f.content_id,
      ...f.content,
    })) || [];

  if (!favorites.isLoading && favoritesList.length === 0) {
    return (
      <div
        className="pt-24 min-h-screen px-6 sm:px-10"
        style={{ background: "#0D0D0F" }}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#A8A8B3] mb-6">
          My List
        </p>
        <div className="text-center py-24 space-y-3">
          <p className="text-white font-medium">Your list is empty</p>
          <p className="text-sm text-[#6B6B7B]">
            Add titles to your list while browsing.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen" style={{ background: "#0D0D0F" }}>
      <Row title="My List" data={favoritesList} isLoading={favorites.isLoading} />
    </div>
  );
}