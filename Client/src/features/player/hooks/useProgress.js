import { useEffect } from "react";
import { saveProgress, trackEvent } from "../api/playerApi";

export function useProgress({contentId, playerRef}){
    useEffect(() => {
        const player = playerRef.current;
        if(!player) return;

        const onPlay = () => {
            trackEvent({ type: "play", contentId });
        };

        const onPause = () => {
            trackEvent({type: "pause", contentId, currentTime: player.currentTime});
        }


        const onEnded = () => {
            saveProgress({contentId, progress:player.duration});
            trackEvent({type: "end", contentId});
        }

        player.addEventListener("play", onPlay);
        player.addEventListener("pause", onPause);
        player.addEventListener("ended", onEnded);

        return () => {
            player.removeEventListener("play", onPlay);
            player.removeEventListener("pause", onPause);
            player.removeEventListener("ended", onEnded);
        }
    },[contentId, playerRef]);
}