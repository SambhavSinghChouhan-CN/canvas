import { useParams } from "react-router-dom";
import { products } from "@/data/products";
import  {ProductCard}  from "@/components/ProductCard";

const CategoryProduct = () => {
  const { category } = useParams<{ category: string }>();

  const filteredProducts = products.filter(
    (product) => product.category === category
  );

  return (
    <div className="px-6 py-10">
      <h1 className="text-3xl font-bold capitalize mb-8">
        {category} Products
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryProduct;
