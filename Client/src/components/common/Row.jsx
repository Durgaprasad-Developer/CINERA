import ContentCard from "./ContentCard";
import Skeleton from "../ui/Skeleton";

export default function Row({ title, data = [], isLoading }) {
  if (!isLoading && (!Array.isArray(data) || data.length === 0)) return null;

  return (
    <section className="mb-2">
      {/* Row title */}
      <h2 className="text-sm font-semibold text-[#A8A8B3] hover:text-white transition-colors duration-150 mb-3 px-6 sm:px-10 uppercase tracking-[0.08em] cursor-default">
        {title}
      </h2>

      {/* Scrollable card row */}
      <div className="flex gap-3 overflow-x-auto px-6 sm:px-10 hide-scrollbar pb-2 pt-1">
        {isLoading
          ? Array.from({ length: 7 }).map((_, i) => (
              <Skeleton
                key={i}
                className="flex-none w-[150px] sm:w-[185px] aspect-[2/3] rounded-xl"
              />
            ))
          : data.map((item) => <ContentCard key={item.id} item={item} />)}
      </div>
    </section>
  );
}
