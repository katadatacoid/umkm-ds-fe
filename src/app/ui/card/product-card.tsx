import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShop } from '@fortawesome/free-solid-svg-icons';

interface ProductCardProps {
  imageUrl: string;
  title: string;
  price: string;
  originalPrice: string;
  discount: string;
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageUrl,
  title,
  price,
  originalPrice,
  discount,
  rating,
}) => {
    const placeholderImage ='https://via.placeholder.com/300x200/808080/FFFFFF?text=No+Image'; // Replace with your placeholder image URL

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
    <img
        src={imageUrl && imageUrl !== "" ? imageUrl : placeholderImage}
        alt={title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-sm text-gray-800">{title}</h3>
        <div className="flex items-center my-2">
          <span className="text-yellow-400">{"★".repeat(rating)}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 line-through">{originalPrice}</span>
            <span className="text-green-600 font-semibold">{price}</span>
          </div>
          <span className="text-red-500 font-semibold">{discount}</span>
          <div className="mt-4 flex justify-end">
          <button className="px-2 py-1 bg-green-c text-white font-semibold rounded-lg hover:bg-green-800 transition">
            <FontAwesomeIcon icon={faShop} />
          </button>
        </div>
        </div>
       
      </div>
    </div>
  );
};

export default ProductCard;
