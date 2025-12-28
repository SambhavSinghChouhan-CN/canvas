import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  liked: boolean;
}

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([
    {
      id: 1,
      name: "Canvas Buddha Painting",
      price: "₹2,499",
      image: "/src/assets/products/canvas-buddha.jpg",
      liked: true,
    },
    {
      id: 2,
      name: "Crystal Butterfly Wall Art",
      price: "₹1,899",
      image: "/src/assets/products/crystal-butterfly.jpg",
      liked: true,
    },
  ]);

  
  // Toggle heart color
  const toggleHeart = (id: number) => {
    setWishlistItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, liked: !item.liked }
          : item
      )

    );
    setWishlistItems(prev => prev.filter(item => item.id !== id));

    toast.success("Removed from wishlist");
  };

  return (
    <div className="container py-16">
      <h1 className="text-3xl font-semibold mb-8 flex items-center gap-2">
        <Heart className="text-primary" />
        My Wishlist
      </h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-20">
          <Heart size={48} className="mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-6">
            Your wishlist is empty
          </p>
          <Link
            to="/shop"
            className="px-6 py-3 bg-primary text-white rounded-lg"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlistItems.map(item => (
            <div
              key={item.id}
              className="relative border border-border rounded-xl p-4 bg-background hover:shadow-lg transition"
            >
              {/* Heart Icon */}
              <button
                onClick={() => toggleHeart(item.id)}
                className={`absolute top-3 left-3 transition ${
                  item.liked ? "text-red-500" : "text-muted-foreground"
                }`}
                title="Toggle wishlist"
              >
                <Heart
                  size={20}
                  fill={item.liked ? "currentColor" : "none"}
                />
              </button>

              
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-52 object-cover rounded-lg mb-4"
              />

              <h3 className="font-medium text-lg mb-1">
                {item.name}
              </h3>

              <p className="text-primary font-semibold mb-4">
                {item.price}
              </p>

              <div className="flex justify-between items-center">
                <Link
                  to={`/product/${item.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  View Product
                </Link>

                <button className="px-4 py-2 text-sm border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
