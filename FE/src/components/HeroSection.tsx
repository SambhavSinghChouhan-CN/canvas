import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroImage from '@/assets/hero-bg.jpg';
import { categories } from '@/data/products';
import CategoryCard from './CategoryCard';

const HeroSection = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-background/70" />
      
      {/* Content */}
      <div className="container relative z-10 py-20">
        <div className="text-center max-w-4xl mx-auto mb-12 animate-fade-in">
          <p className="text-primary italic font-display text-xl md:text-2xl mb-4">
            New Updates
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground uppercase tracking-wide mb-6">
            Completing Your Home Decor Search
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover premium wall art, crystal paintings, moving gear clocks, and designer wallpapers to transform your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button className="btn-gold px-8 py-6 text-lg">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="outline" className="px-8 py-6 text-lg border-foreground/20 hover:bg-secondary">
                View Collections
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {categories.map((cat, index) => (
            <div 
              key={cat.id} 
              className="animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CategoryCard category={cat} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
