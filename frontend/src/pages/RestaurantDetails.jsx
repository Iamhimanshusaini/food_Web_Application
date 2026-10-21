import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  UtensilsCrossed,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import FoodCard from "../components/FoodCard";
import API from "../api/api";

export default function RestaurantDetails() {
  const { id } = useParams();

  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [foodType, setFoodType] = useState("All");
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch restaurant, categories and food items
  useEffect(() => {
    const getRestaurantDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const [restaurantRes, categoryRes, foodRes] =
          await Promise.all([
            axios.get(`${API}/restaurant/${id}`),
            axios.get(`${API}/restaurant/categories`),
            axios.get(`${API}/restaurant/foods`),
          ]);

        const restaurantData = restaurantRes.data.restaurant;
        const categoryData = categoryRes.data.categories;
        const foodData = foodRes.data.foods;

        setRestaurant(restaurantData || null);
        setCategories(
          Array.isArray(categoryData) ? categoryData : []
        );
        setFoods(Array.isArray(foodData) ? foodData : []);
      } catch (err) {
        console.error(
          "Restaurant details error:",
          err.response?.data || err.message
        );

        setError(
          err.response?.data?.message ||
            "Unable to load restaurant details. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getRestaurantDetails();
    }
  }, [id]);

  // Get current restaurant food items
  const restaurantFoods = useMemo(() => {
    if (!restaurant?._id) return [];

    return foods.filter((food) => {
      const foodRestaurantId = String(
        food.restaurantId?._id || food.restaurantId || ""
      );

      return foodRestaurantId === String(restaurant._id);
    });
  }, [foods, restaurant]);

  // Get categories belonging to current restaurant
  const restaurantCategories = useMemo(() => {
    if (!restaurant?._id) return [];

    return categories.filter((category) => {
      const categoryRestaurantId = String(
        category.restaurantId?._id ||
          category.restaurantId ||
          ""
      );

      return (
        categoryRestaurantId === String(restaurant._id) &&
        category.isActive !== false
      );
    });
  }, [categories, restaurant]);

  // Create category tabs
  const categoryTabs = useMemo(() => {
    const categoryNames = restaurantCategories
      .map((category) => category.name)
      .filter(Boolean);

    // Include food categories if category API data is unavailable
    const foodCategoryNames = restaurantFoods
      .map((food) => food.categoryName || food.category)
      .filter(Boolean);

    return [
      "All",
      ...new Set([...categoryNames, ...foodCategoryNames]),
    ];
  }, [restaurantCategories, restaurantFoods]);

  // Filter menu by category, Veg/Non-Veg and search
  const filteredFoods = useMemo(() => {
    return restaurantFoods.filter((food) => {
      const categoryName = food.categoryName || food.category;

      const matchesCategory =
        selectedCategory === "All" ||
        categoryName === selectedCategory;

      // Assumes Product documents store foodType as "Veg" or "Non-Veg"
      const matchesFoodType =
        foodType === "All" ||
        String(food.foodType || "").toLowerCase() ===
          foodType.toLowerCase();

      const searchText = search.trim().toLowerCase();

      const matchesSearch =
        !searchText ||
        String(food.name || "")
          .toLowerCase()
          .includes(searchText) ||
        String(food.description || "")
          .toLowerCase()
          .includes(searchText);

      return (
        matchesCategory &&
        matchesFoodType &&
        matchesSearch
      );
    });
  }, [restaurantFoods, selectedCategory, foodType, search]);

  // Loading UI
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
          <p className="mt-4 font-medium text-gray-600">
            Loading restaurant...
          </p>
        </div>
      </div>
    );
  }

  // Error UI
  if (error || !restaurant) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="rounded-full bg-orange-100 p-5 text-orange-500">
          <UtensilsCrossed size={36} />
        </div>

        <h2 className="mt-5 text-2xl font-bold text-gray-900">
          Restaurant not found
        </h2>

        <p className="mt-2 max-w-md text-gray-500">
          {error || "This restaurant may no longer be available."}
        </p>

        <Link
          to="/restaurants"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          <ArrowLeft size={18} />
          Back to Restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Page container */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Back button */}
        <Link
          to="/restaurants"
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-gray-600 transition hover:text-orange-500"
        >
          <ArrowLeft size={18} />
          All Restaurants
        </Link>

        {/* Restaurant banner */}
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="grid md:grid-cols-2">
            {/* Restaurant image */}
            <div className="relative h-64 overflow-hidden bg-gray-100 sm:h-80 md:h-full md:min-h-[320px]">
              <img
                src={
                  restaurant.image ||
                  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000"
                }
                alt={restaurant.name || "Restaurant"}
                className="h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

              <div className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-sm font-semibold text-gray-800 shadow">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
                {restaurant.isApproved === false
                  ? "Currently unavailable"
                  : "Restaurant"}
              </div>
            </div>

            {/* Restaurant info */}
            <div className="flex flex-col justify-center p-6 sm:p-9">
              <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
                Welcome to
              </p>

              <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                {restaurant.name}
              </h1>

              {restaurant.description && (
                <p className="mt-3 leading-7 text-gray-500">
                  {restaurant.description}
                </p>
              )}

              {/* Rating and delivery info */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                  <Star size={17} fill="currentColor" />
                  {restaurant.rating ?? "New"}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm font-semibold text-orange-700">
                  <Clock size={17} />
                  {restaurant.deliveryTime || "30–40 min"}
                </div>

                {restaurant.deliveryFee !== undefined && (
                  <div className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700">
                    Delivery ₹{restaurant.deliveryFee}
                  </div>
                )}
              </div>

              {/* Address */}
              {restaurant.address && (
                <div className="mt-5 flex items-start gap-2 text-sm leading-6 text-gray-500">
                  <MapPin
                    size={19}
                    className="mt-0.5 shrink-0 text-orange-500"
                  />
                  <span>{restaurant.address}</span>
                </div>
              )}

              {/* Cuisine */}
              {Array.isArray(restaurant.cuisine) &&
                restaurant.cuisine.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {restaurant.cuisine.map((item, index) => (
                      <span
                        key={`${item}-${index}`}
                        className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-700"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </section>

        {/* Menu heading */}
        <section className="mb-5 mt-10">
          <p className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Delicious choices
          </p>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
                Explore Menu
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Find your favourite food.
              </p>
            </div>

            <div className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-gray-600 shadow-sm ring-1 ring-gray-100">
              {filteredFoods.length} items
            </div>
          </div>
        </section>

        {/* Filters panel */}
        <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          {/* Search */}
          <div className="relative mb-5">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search food items..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
            />
          </div>

          {/* Categories + Veg / Non-Veg toggle */}
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            {/* Category tabs */}
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-gray-700">
                <SlidersHorizontal
                  size={16}
                  className="text-orange-500"
                />
                Categories
              </div>

              <div className="flex flex-wrap gap-2">
                {categoryTabs.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
                        : "border border-gray-200 bg-white text-gray-600 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Veg / Non-Veg toggle */}
            <div className="shrink-0">
              <p className="mb-3 text-sm font-bold text-gray-700">
                Food Preference
              </p>

              <div className="flex w-fit items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
                {/* All */}
                <button
                  type="button"
                  onClick={() => setFoodType("All")}
                  className={`rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                    foodType === "All"
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  All
                </button>

                {/* Veg */}
                <button
                  type="button"
                  onClick={() => setFoodType("Veg")}
                  aria-pressed={foodType === "Veg"}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                    foodType === "Veg"
                      ? "bg-green-50 text-green-700 ring-1 ring-green-500"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <span className="flex h-[18px] w-[18px] items-center justify-center border-2 border-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-600" />
                  </span>
                  Veg
                </button>

                {/* Non-Veg */}
                <button
                  type="button"
                  onClick={() => setFoodType("Non-Veg")}
                  aria-pressed={foodType === "Non-Veg"}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-bold transition ${
                    foodType === "Non-Veg"
                      ? "bg-red-50 text-red-700 ring-1 ring-red-500"
                      : "text-gray-600 hover:bg-white"
                  }`}
                >
                  <span className="flex h-[18px] w-[18px] items-center justify-center border-2 border-red-600">
                    <span className="h-2 w-2 rounded-full bg-red-600" />
                  </span>
                  Non-Veg
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Food listing */}
        <section className="mt-7">
          {filteredFoods.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFoods.map((food) => (
                <FoodCard
                  key={food._id || food.id}
                  food={food}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-gray-300 bg-white px-5 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <UtensilsCrossed size={30} />
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                No food items found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Try another category or food preference, or search
                for a different item.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setFoodType("All");
                  setSearch("");
                }}
                className="mt-5 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Clear Filters
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}