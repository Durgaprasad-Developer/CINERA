import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import{
    likeContent,
    unlikeContent,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    getLikes,
} from "../api/favoritesApi";

export function useFavorites() {
    const queryClient = useQueryClient();

    const favorites = useQuery({
        queryKey: ["favorites"],
        queryFn: getFavorites,
    });

    const likes = useQuery({
        queryKey: ["likes"],
        queryFn: getLikes,
    });

    const like = useMutation({
        mutationFn: likeContent,
        onSuccess: () => queryClient.invalidateQueries("likes"),
    });

    const unlike = useMutation({
        mutationFn: unlikeContent,
        onSuccess: () => queryClient.invalidateQueries(["likes"]),
    });

    const addFavorite = useMutation({
        mutationFn: addToFavorites,
        onSuccess: () => queryClient.invalidateQueries(["favorites"]),
    });

    const removeFavorite = useMutation({
        mutationFn: removeFromFavorites,
        onSuccess: () => queryClient.invalidateQueries(["favorites"]),
    });

    
    return {
        favorites,
        likes,
        like,
        unlike,
        addFavorite,
        removeFavorite,
    };
}