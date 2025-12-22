import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStreamUrl } from "../api/playerApi";

export default function PlayerPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["stream", id],
    queryFn: () => getStreamUrl(id),
  });

  if (isLoading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-gray-400">
        Loading video...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-red-500">
        Failed to load video
      </div>
    );
  }

  const streamUrl = data.data.streamUrl;

  return (
    <div className="bg-black min-h-screen flex flex-col">
      <video
        src={streamUrl}
        controls
        autoPlay
        className="w-full h-full max-h-screen bg-black"
      />
    </div>
  );
}
