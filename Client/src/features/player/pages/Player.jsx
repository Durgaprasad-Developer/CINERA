import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStreamUrl } from "../api/playerApi";

import { useEffect } from "react";

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

  useEffect(() => {
  if (streamUrl) {
    console.log("🎬 VIDEO SRC SET", {
      time: new Date().toISOString(),
      streamUrlPreview: streamUrl.slice(0, 80),
    });
  }
}, [streamUrl]);


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
