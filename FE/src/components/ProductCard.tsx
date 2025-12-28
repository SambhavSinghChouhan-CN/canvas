import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/data/products';
import { useCart } from '@/context/CartContext';
import { useReduxWishlist } from '@/redux/wishlist/ReduxWishlistProvider';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useReduxWishlist();
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    const inWishlist = wishlist.some(item => item.product.id === parseInt(product.id, 10));
    setIsInWishlist(inWishlist);
  }, [wishlist, product.id]);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category
    });
    toast.success('Added to cart!', { description: product.name });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = parseInt(product.id, 10);
    if (isInWishlist) {
      removeFromWishlist(productId);
      toast.success('Removed from wishlist!', { description: product.name });
    } else {
      addToWishlist(productId);
      toast.success('Added to wishlist!', { description: product.name });
    }
  };

  return (
    <Link 
      to={`/product/${product.id}`}
      className="group bg-card rounded-lg overflow-hidden card-hover block border border-border"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button 
            className="p-2 bg-card/90 backdrop-blur-sm rounded-full text-foreground hover:text-primary hover:bg-card transition-colors"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'text-red-500 fill-red-500' : ''}`} />
          </button>
        </div>

        {/* Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Button 
            onClick={handleAddToCart}
            className="w-full btn-gold flex items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <p className="text-xs text-primary font-medium uppercase tracking-wider mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-primary fill-primary' : 'text-muted'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-primary">₹{product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export { ProductCard };

