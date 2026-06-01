import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="bg-cardDark border border-borderDark rounded-xl overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-2xl">
      <div className="h-48 bg-gray-800 flex items-center justify-center">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-gray-500">Sin Imagen</span>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
        <p className="text-sm text-gray-400 mb-4 h-10 overflow-hidden">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-xl">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => addToCart(product)}
            className="bg-primary hover:bg-primaryHover text-black font-semibold py-2 px-4 rounded-lg transition"
          >
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}
