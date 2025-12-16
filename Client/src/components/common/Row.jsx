import ContentCard from "./ContentCard";
import Skeleton from "../ui/Skeleton";

export default function Row({ title, data = [], isLoading }) {
  // Defensive guard
  if (!isLoading && !Array.isArray(data)) {
    return null;
  }

  if (!isLoading && data.length === 0) {
    return null;
  }

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4 px-6 text-white">
        {title}
      </h2>

      <div className="flex gap-4 overflow-x-auto px-6 scrollbar-hide">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="min-w-[160px] h-48 rounded-lg"
              />
            ))
          : data.map((item) => (
              <ContentCard key={item.id} item={item} />
            ))}
      </div>
    </section>
  );
}
