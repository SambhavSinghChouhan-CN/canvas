import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { ReduxWishlistProvider } from "@/redux/wishlist/ReduxWishlistProvider";

import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import CategoryProducts from "./pages/CategoryProducts";
import Wishlist from "./pages/Wishlist";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ReduxWishlistProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/shop/:category" element={<Shop />} />
                  <Route path="/shop/:slug" element={<CategoryProducts />} />

                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/cart" element={<Cart />} />

                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/login" element={<Auth />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/checkout" element={<Checkout />} />

                  {/* MUST ALWAYS BE LAST */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </CartProvider>
        </ReduxWishlistProvider>
      </AuthProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
