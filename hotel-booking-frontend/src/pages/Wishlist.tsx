import { useQuery } from "react-query";
import { getWishlist, toggleWishlist } from "../api-client";
import { MapPin, Star } from "lucide-react";

const Wishlist = () => {
  const { data, isLoading, refetch } = useQuery("wishlist", getWishlist);

  if (isLoading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">
        ❤️ My Wishlist
      </h1>

      {data?.length === 0 ? (
        <div className="text-center text-gray-500">
          No saved hotels yet 😔
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((hotel: any) => (
            <div
              key={hotel._id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={hotel.imageUrls[0]}
                  className="h-48 w-full object-cover"
                />

                {/* Remove Button */}
                <button
                  onClick={async () => {
                    await toggleWishlist(hotel._id);
                    refetch();
                  }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow text-red-500"
                >
                  ❤️
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-2">
                <h2 className="text-lg font-bold">{hotel.name}</h2>

                <div className="flex items-center text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  {hotel.city}, {hotel.country}
                </div>

                <div className="flex items-center text-yellow-500 text-sm">
                  <Star className="w-4 h-4 mr-1" />
                  {hotel.starRating}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="font-semibold text-primary-600">
                    £{hotel.pricePerNight}
                  </span>

                  <a
                    href={`/detail/${hotel._id}`}
                    className="text-sm bg-primary-600 text-white px-3 py-1 rounded-lg hover:bg-primary-700"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;