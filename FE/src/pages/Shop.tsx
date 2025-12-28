import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Layout from '@/components/Layout';
import {ProductCard} from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { products, categories, getProductsByCategory } from '@/data/products';
import { ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

const Shop = () => {
  const { category } = useParams();
  const [sortBy, setSortBy] = useState('default');

  const currentCategory = category
    ? categories.find(c => c.slug === category)
    : null;

  let displayProducts = category
    ? getProductsByCategory(category)
    : products;

  // SORTING
  switch (sortBy) {
    case 'price-low':
      displayProducts = [...displayProducts].sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      displayProducts = [...displayProducts].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      displayProducts = [...displayProducts].sort((a, b) => b.rating - a.rating);
      break;
    default:
      break;
  }

  return (
    <Layout>
      <Helmet>
        <title>
          {currentCategory
            ? `${currentCategory.name} | YF Decor`
            : 'Shop | YF Decor'}
        </title>
        <meta
          name="description"
          content={
            currentCategory
              ? `Shop ${currentCategory.name} at YF Decor`
              : 'Browse premium home decor products'
          }
        />
      </Helmet>

      {/* BREADCRUMB */}
      <section className="bg-secondary py-8 border-b border-border">
        <div className="container">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link to="/" className="hover:text-primary">HOME</Link>
            <ChevronRight className="h-4 w-4" />
            {currentCategory ? (
              <>
                <Link to="/shop" className="hover:text-primary">SHOP</Link>
                <ChevronRight className="h-4 w-4" />
                <span className="text-foreground">
                  {currentCategory.name.toUpperCase()}
                </span>
              </>
            ) : (
              <span className="text-foreground">SHOP</span>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="font-display text-3xl md:text-4xl font-bold">
              {currentCategory ? currentCategory.name : 'Shop Online at YF Decor'}
            </h1>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48 bg-card border-border">
                <SelectValue placeholder="Default sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default sorting</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">By Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* CATEGORY GRID */}
      {!currentCategory && (
        <section className="py-12 bg-background">
          <div className="container">
            <h2 className="text-2xl font-semibold mb-8 text-center">
              Shop by Category
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.map(cat => (
                <CategoryCard key={cat.id} category={cat} variant="large" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS */}
      <section className="py-12 bg-secondary">
        <div className="container">
          <p className="text-muted-foreground mb-6">
            Showing {displayProducts.length} results
          </p>

          {displayProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg mb-4 text-muted-foreground">
                No products found.
              </p>
              <Link to="/shop" className="text-primary font-medium">
                View all products
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
