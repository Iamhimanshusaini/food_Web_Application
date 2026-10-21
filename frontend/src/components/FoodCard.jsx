
import { Plus, Star, Clock, ShoppingBag, Flame } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function FoodCard({ food }) {
  const { addToCart, cart } = useCart();

  const qty =
    cart.find(
      (item) =>
        String(item.id || item._id) === String(food.id || food._id)
    )?.quantity || 0;

  const isVeg = food.foodType?.toLowerCase() === "veg";
  const isAvailable = food.isAvailable && food.isActive;

  const price = Number(food.discountPrice ?? food.price);
  const originalPrice = Number(food.price);
  const discount =
    originalPrice > price && originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  const handleAddToCart = () => {
    if (!isAvailable || food.stock <= 0) return;

    addToCart({
      ...food,
      id: food.id || food._id,
      price,
    });
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Food Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            !isAvailable ? "grayscale" : ""
          }`}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute left-3 top-3 rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-md">
            {discount}% OFF
          </span>
        )}

        {/* Veg / Non-veg Badge */}
        <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
          <span
            className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border-2 ${
              isVeg ? "border-green-600" : "border-red-600"
            }`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isVeg ? "bg-green-600" : "bg-red-600"
              }`}
            />
          </span>
          {isVeg ? "Veg" : "Non-Veg"}
        </span>

        {/* Availability */}
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <span className="rounded-full bg-white px-4 py-2 text-sm font-bold text-gray-800">
              Currently Unavailable
            </span>
          </div>
        )}

        {/* Featured */}
        {food.isFeatured && (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-yellow-400 px-2.5 py-1 text-xs font-bold text-gray-900">
            <Flame size={13} /> Bestseller
          </span>
        )}
      </div>

      {/* Food Details */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="truncate rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
            {food.categoryName || food.category || "Food"}
          </span>

          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-gray-700">
            <Star size={15} className="fill-amber-400 text-amber-400" />
            {Number(food.rating || 0).toFixed(1)}
            <span className="text-xs font-normal text-gray-400">
              ({food.totalReviews || 0})
            </span>
          </span>
        </div>

        <h3 className="truncate text-lg font-bold capitalize text-gray-900 transition-colors group-hover:text-orange-600">
          {food.name}
        </h3>

        <p className="mt-1.5 min-h-10 text-sm leading-5 text-gray-500">
          {food.description || "Freshly prepared with quality ingredients."}
        </p>

        {/* Preparation Time and Serving */}
        <div className="mt-3 flex items-center gap-3 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} className="text-orange-500" />
            {food.preparationTime || 20} min
          </span>

          {food.servingSize && (
            <span className="rounded-md bg-gray-100 px-2 py-1">
              {food.servingSize}
            </span>
          )}
        </div>

        {/* Price and Add Button */}
        <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-extrabold text-gray-900">
                ₹{price}
              </span>

              {discount > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>

            {food.stock > 0 && food.stock <= 5 && (
              <p className="mt-1 text-xs font-medium text-red-500">
                Only {food.stock} left!
              </p>
            )}
          </div>

          <button
            type="button"
            disabled={!isAvailable || food.stock <= 0}
            onClick={handleAddToCart}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {qty > 0 ? (
              <>
                <ShoppingBag size={16} />
                {qty} Added
                <Plus size={15} />
              </>
            ) : (
              <>
                <Plus size={17} />
                Add
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
