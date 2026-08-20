import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getStreamUrl } from "../api/playerApi";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getProgressForContent, saveProgress } from "../../history/api/historyApi";

export default function PlayerPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [startTime, setStartTime] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["stream", id],
    queryFn: () => getStreamUrl(id),
  });

  const streamUrl = data?.data?.streamUrl;

  useEffect(() => {
    getProgressForContent(id)
      .then((res) => {
        if (res.progress?.last_watched_seconds > 0) {
          setStartTime(res.progress.last_watched_seconds);
        }
      })
      .catch(console.error);
  }, [id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        saveProgress(id, videoRef.current.currentTime, videoRef.current.duration).catch(
          console.error
        );
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const handleLoadedMetadata = () => {
    if (videoRef.current && startTime > 0) {
      videoRef.current.currentTime = startTime;
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-white/20 border-t-white animate-spin" />
      </div>
    );
  }

  if (error || !streamUrl) {
    return (
      <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center gap-4">
        <p className="text-[#A8A8B3]">Failed to load video</p>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-white border border-white/20 px-4 py-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col group">
      {/* Back button — appears on hover */}
      <div className="absolute top-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 bg-gradient-to-b from-black/70 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <video
        ref={videoRef}
        src={streamUrl}
        controls
        autoPlay
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full h-full object-contain bg-black"
      />
    </div>
  );
}
