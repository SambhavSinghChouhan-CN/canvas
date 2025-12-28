import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import { getProductById } from '@/data/products';
import { Star } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();

  const product = id ? getProductById(id) : null;

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h2 className="text-2xl font-semibold">Product not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-12 grid md:grid-cols-2 gap-10">
        {/* IMAGE */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full rounded-lg"
        />

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-primary fill-primary'
                    : 'text-muted'
                }`}
              />
            ))}
            <span className="ml-2 text-sm">({product.rating})</span>
          </div>

          <p className="text-muted-foreground mb-4">
            {product.description}
          </p>

          <p className="text-2xl font-bold text-primary">
            ₹{product.price.toLocaleString()}
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
