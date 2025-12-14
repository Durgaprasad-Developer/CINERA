import {useParams} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {useRef} from "react";
import { getSteamUrl } from "../api/playerApi";
import {userProgress} from "../hooks/useUserProgress";

export default function Player() {
    const {id} = useParams();
    const playerRef = useRef(null);

    const { data, isLoading } = useQuery({
        queryKey: ["stream", id],
        qyeryFn: () => getSteamUrl(id),
    });

    useProgress({
        contentId: id,
        playerRef,
    });

    if(isLoading){
        return(
            <div className="min-h-screen flex items-center justify-center text-white">
                Loading player...
            </div>
        );
    }

    const streamUrl = data.data.url;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center">
            <video ref={playerRef} src={streamUrl} controls autoplay className="w-full max-w-5xl rounded-lg"/>
        </div>
    )
}