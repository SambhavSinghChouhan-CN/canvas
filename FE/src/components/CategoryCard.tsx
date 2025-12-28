import { Link } from 'react-router-dom';
import { Category } from '@/data/products';

interface CategoryCardProps {
  category: Category;
  variant?: 'small' | 'large';
}

const CategoryCard = ({ category, variant = 'small' }: CategoryCardProps) => {
  const heightClass = variant === 'large' ? 'h-48' : 'h-28';

  return (
    <Link to={`/category/${category.slug}`} className="block group">
      <div className={`relative overflow-hidden rounded-lg bg-card border border-border ${heightClass}`}>
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
          <div>
            <h3 className="text-white font-semibold text-sm md:text-base">{category.name}</h3>
            <p className="text-white/80 text-xs">{category.productCount} items</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
