import Row from "../../../components/common/Row";
import { useFavorites } from "../hooks/useFavorites";


export default function MyList() {
    const { favorites } = useFavorites();

    if (!favorites.isLoading && favorites.data?.data?.length === 0) {
  return (
    <div className="p-6 text-gray-400">
      You haven’t added anything to My List yet.
    </div>
  );
}


    return (
        <div className="pt-6">
            <Row title="My List" data={favorites.data?.data} isLoading={favorites.isLoading}/>
        </div>
    )
}