import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, Phone, ChevronDown, X, User } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { categories } from '@/data/products';

const Header = () => {
  const { totalItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isHome = location.pathname === '/';

  return (
    <>
      {/* Top Bar */}
      <div className="bg-secondary text-center py-2 text-sm">
        <div className="container flex items-center justify-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <span className="text-muted-foreground">SALES SUPPORT:</span>
          <a href="tel:+919876543210" className="text-primary font-medium hover:text-gold-light transition-colors">
            +91 98765 43210
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 ${isHome ? 'bg-background/95 backdrop-blur-md' : 'bg-background'} border-b border-border`}>
        <div className="container py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-1">
              <span className="text-2xl font-display font-bold tracking-tight">
                <span className="text-primary">yf</span>
                <span className="text-foreground">decor</span>
              </span>
              <span className="text-xs text-muted-foreground">.com</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <Link 
                to="/shop/crystal-paintings" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
              >
                Crystal Paintings
              </Link>
              <div className="relative group">
                <button className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide">
                  Canvas Art
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-card rounded-lg shadow-lg border border-border p-4 min-w-[200px]">
                    {categories.filter(c => c.slug === 'canvas-paintings').map(cat => (
                      <Link 
                        key={cat.id}
                        to={`/shop/${cat.slug}`}
                        className="block py-2 text-sm text-foreground hover:text-primary transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
              <Link 
                to="/shop/wallpapers" 
                className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
              >
                Wallpapers
                <ChevronDown className="h-4 w-4" />
              </Link>
              <Link 
                to="/shop/gear-clocks" 
                className="text-sm font-medium text-foreground hover:text-primary transition-colors uppercase tracking-wide"
              >
                Gear Clocks
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {user ? (
                <Link 
                  to="/account"
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                  <span>MY ACCOUNT</span>
                </Link>
              ) : (
                <Link 
                  to="/login"
                  className="hidden md:block text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  LOGIN / REGISTER
                </Link>
              )}
              
              <button className="p-2 text-foreground hover:text-primary transition-colors">
                <Search className="h-5 w-5" />
              </button>
              
              <Link to="/account" className="hidden sm:block p-2 text-foreground hover:text-primary transition-colors">
                <Heart className="h-5 w-5" />
              </Link>
              
              <Link to="/cart" className="relative p-2 text-foreground hover:text-primary transition-colors">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>

              <button 
                className="lg:hidden p-2 text-foreground"
                onClick={() => setMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-card border-l border-border p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-lg font-display font-bold">Menu</span>
              <button onClick={() => setMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {categories.map(cat => (
                <Link 
                  key={cat.id}
                  to={`/shop/${cat.slug}`}
                  className="py-2 text-foreground hover:text-primary transition-colors font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <hr className="border-border my-4" />
              <Link 
                to="/shop" 
                className="py-2 text-primary font-semibold"
                onClick={() => setMobileMenuOpen(false)}
              >
                View All Products
              </Link>
              {user ? (
                <Link 
                  to="/account" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Account
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="py-2 text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login / Register
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
