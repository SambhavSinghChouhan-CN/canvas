import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import {ProductCard } from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { products, categories } from '@/data/products';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RefreshCw, Headphones } from 'lucide-react';

const Index = () => {
  const featuredProducts = products.slice(0, 4);

  return (
    <Layout>
      <Helmet>
        <title>YF Decor - Premium Home Decor | Canvas Paintings, Crystal Art, Wallpapers</title>
        <meta name="description" content="Shop premium home decor at YF Decor. Discover beautiful canvas paintings, crystal glass art, moving gear clocks, and designer wallpapers. Transform your space today!" />
      </Helmet>

      <HeroSection />

      {/* Categories */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Browse our Categories
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collection of home decor items perfect for every style and space
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
                Featured Products
              </h2>
              <p className="text-muted-foreground">Our best-selling home decor pieces</p>
            </div>
            <Link 
              to="/shop" 
              className="hidden md:flex items-center gap-2 text-primary hover:text-gold-light transition-colors font-medium"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <Link 
            to="/shop" 
            className="flex md:hidden items-center justify-center gap-2 text-primary hover:text-gold-light transition-colors font-medium mt-8"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

