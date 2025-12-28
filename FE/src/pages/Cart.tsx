import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag, ChevronRight } from 'lucide-react';
import CategoryCard from '@/components/CategoryCard';
import { categories } from '@/data/products';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  return (
    <Layout>
      <Helmet>
        <title>Shopping Cart | YF Decor</title>
        <meta name="description" content="Review your shopping cart and proceed to checkout at YF Decor." />
      </Helmet>

      {/* Cart Steps */}
      <section className="bg-secondary py-8 border-b border-border">
        <div className="container">
          <div className="flex items-center justify-center gap-4 md:gap-8 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                1
              </span>
              <span className="hidden sm:inline text-foreground font-semibold">SHOPPING CART</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
                2
              </span>
              <span className="hidden sm:inline text-muted-foreground">CHECKOUT DETAILS</span>
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-bold">
                3
              </span>
              <span className="hidden sm:inline text-muted-foreground">ORDER COMPLETE</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-background min-h-[60vh]">
        <div className="container">
          {items.length === 0 ? (
            /* Empty Cart */
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-2">
                Your cart is currently empty.
              </h2>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't added any items to your cart yet.
              </p>
              <Link to="/shop">
                <Button className="btn-gold px-8">
                  Return to Shop
                </Button>
              </Link>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                  {/* Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border bg-secondary text-sm font-semibold text-muted-foreground uppercase">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-center">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>

                  {/* Items */}
                  {items.map((item) => (
                    <div 
                      key={item.id}
                      className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border items-center"
                    >
                      {/* Product */}
                      <div className="md:col-span-6 flex items-center gap-4">
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div>
                          <Link 
                            to={`/product/${item.id}`}
                            className="font-medium text-foreground hover:text-primary transition-colors line-clamp-2"
                          >
                            {item.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1">{item.category}</p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                        <span className="md:hidden text-sm text-muted-foreground">Price:</span>
                        <span className="text-foreground">₹{item.price.toLocaleString()}</span>
                      </div>

                      {/* Quantity */}
                      <div className="md:col-span-2 flex md:justify-center items-center gap-2">
                        <span className="md:hidden text-sm text-muted-foreground">Qty:</span>
                        <div className="flex items-center border border-border rounded-lg">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-secondary transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="md:col-span-2 flex md:justify-end items-center gap-2">
                        <span className="md:hidden text-sm text-muted-foreground">Subtotal:</span>
                        <span className="font-semibold text-primary">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Actions */}
                  <div className="p-4 flex flex-wrap gap-4 justify-between">
                    <Link to="/shop">
                      <Button variant="outline" className="border-border hover:bg-secondary">
                        Continue Shopping
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      className="border-destructive text-destructive hover:bg-destructive/10"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
                  <h3 className="font-display text-xl font-semibold text-foreground mb-6">
                    Cart Summary
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-green-500">Free</span>
                    </div>
                    <hr className="border-border" />
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-foreground">Total</span>
                      <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button className="w-full btn-gold py-6 text-lg">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Secure checkout powered by Razorpay
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Explore Categories */}
      <section className="py-12 bg-secondary border-t border-border">
        <div className="container">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-8 text-center">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.slice(0, 4).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Cart;
