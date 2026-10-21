import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Search,
  Clock3,
  ShieldCheck,
  Bike,
  Tag,
  Sparkles,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import RestaurantCard from "../components/RestaurantCard";
import FoodCard from "../components/FoodCard";
import SectionTitle from "../components/SectionTitle";
import API from "../api/api";

export default function Home() {
  const [search, setSearch] = useState("");
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);

  // Food filters
  const [foodType, setFoodType] = useState("All");
  const [foodLoading, setFoodLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch restaurants, categories and foods
  useEffect(() => {
    const getFetchData = async () => {
      try {
        setFoodLoading(true);

        const [restaurantsRes, categoryRes, foodRes] =
          await Promise.all([
            axios.get(`${API}/restaurants`),
            axios.get(`${API}/restaurant/categories`),
            axios.get(`${API}/restaurant/foods`),
          ]);

        const restaurantData = restaurantsRes.data?.restaurant;
        const categoryData = categoryRes.data?.categories;
        const foodData = foodRes.data?.foods;

        setRestaurants(
          Array.isArray(restaurantData) ? restaurantData : []
        );

        setCategories(
          Array.isArray(categoryData) ? categoryData : []
        );

        setFoods(Array.isArray(foodData) ? foodData : []);
      } catch (error) {
        console.error(
          "API Error:",
          error.response?.data || error.message
        );
      } finally {
        setFoodLoading(false);
      }
    };

    getFetchData();
  }, []);

  // Remove duplicate categories
  const uniqueCategories = useMemo(() => {
    const categoryMap = new Map();

    categories.forEach((category) => {
      const name = String(category.name || "").trim();

      if (!name) return;

      const key = name.toLowerCase();

      if (!categoryMap.has(key)) {
        categoryMap.set(key, {
          ...category,
          name,
        });
      }
    });

    return Array.from(categoryMap.values());
  }, [categories]);

  // Filter popular dishes by Veg / Non-Veg
  const filteredFoods = useMemo(() => {
    return foods.filter((food) => {
      if (foodType === "All") return true;

      const currentFoodType = String(food.foodType || "")
        .trim()
        .toLowerCase();

      return currentFoodType === foodType.toLowerCase();
    });
  }, [foods, foodType]);

  // Search restaurants / food
  const submitSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    navigate(`/restaurants?search=${encodeURIComponent(query)}`);
  };

  return (
    <>
      {/* ================= HERO SECTION ================= */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <div className="pointer-events-none absolute -left-24 top-10 -z-10 h-64 w-64 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-20 bottom-0 -z-10 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-8 lg:px-10 lg:py-24">
          {/* Hero content */}
          <div className="animate-[fadeUp_0.8s_ease-out_both]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm backdrop-blur">
              <Sparkles size={16} className="animate-pulse" />
              FAST · FRESH · DELICIOUS
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.08] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              Good food.
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 bg-clip-text text-transparent">
                Good mood.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 sm:text-lg">
              Cravings don&apos;t wait. Discover your favorite meals from
              amazing local restaurants and get happiness delivered fresh.
            </p>

            {/* Search form */}
            <form
              onSubmit={submitSearch}
              className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg shadow-orange-100/60 transition-all duration-300 focus-within:border-orange-400 focus-within:shadow-xl focus-within:shadow-orange-100"
            >
              <Search
                size={22}
                className="ml-2 shrink-0 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search pizza, burger, restaurants..."
                className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-gray-400 sm:text-base"
                aria-label="Search food or restaurants"
              />

              <button
                type="submit"
                className="shrink-0 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 px-5 py-3 font-bold text-white shadow-md shadow-orange-200 transition duration-300 hover:-translate-y-0.5 hover:shadow-lg active:scale-95 sm:px-7"
              >
                Search
              </button>
            </form>

            {/* Trust indicators */}
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                  ✓
                </span>
                No minimum order
              </span>

              <span className="flex items-center gap-2">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-xs text-green-700">
                  ✓
                </span>
                Easy ordering
              </span>
            </div>

            {/* Rating */}
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-3">
                {[
                  "photo-1535713875002-d1d0cf377fde",
                  "photo-1494790108377-be9c29b29330",
                  "photo-1500648767791-00dcc994a43e",
                ].map((photo) => (
                  <img
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=80&h=80&q=80`}
                    alt="Happy customer"
                    className="h-10 w-10 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>

              <div>
                <div className="flex items-center gap-1 text-sm font-bold text-gray-800">
                  <Star
                    size={15}
                    className="fill-amber-400 text-amber-400"
                  />
                  4.8/5
                </div>

                <p className="text-xs text-gray-500">
                  Made for food lovers
                </p>
              </div>
            </div>
          </div>

          {/* Hero image */}
          <div className="relative mx-auto w-full max-w-xl animate-[fadeUp_1s_ease-out_both] lg:pl-6">
            <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-orange-300/40 to-rose-300/40 blur-3xl" />

            <div className="relative mx-auto aspect-square max-w-[500px]">
              <div className="absolute inset-4 animate-[spin_35s_linear_infinite] rounded-full border border-dashed border-orange-300/80" />

              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-orange-200 to-rose-100" />

              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=85"
                alt="Freshly prepared food"
                className="absolute inset-[12%] h-[76%] w-[76%] rounded-full object-cover shadow-2xl shadow-orange-900/20 transition duration-700 hover:scale-105"
              />

              {/* Delivery card */}
              <div className="absolute left-0 top-[20%] flex animate-[float_4s_ease-in-out_infinite] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl backdrop-blur sm:p-4">
                <div className="rounded-xl bg-orange-100 p-3 text-orange-600">
                  <Bike size={24} />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-gray-900">
                    Quick delivery
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Fresh to your door
                  </p>
                </div>
              </div>

              {/* Rating card */}
              <div className="absolute bottom-[17%] right-0 flex animate-[float_4s_ease-in-out_1.2s_infinite] items-center gap-3 rounded-2xl border border-white/80 bg-white/95 p-3 shadow-xl backdrop-blur sm:p-4">
                <div className="rounded-xl bg-amber-100 p-3 text-amber-500">
                  <Star size={23} className="fill-amber-400" />
                </div>

                <div>
                  <p className="text-lg font-black text-gray-900">
                    4.8/5
                  </p>
                  <p className="text-xs text-gray-500">
                    Foodie favorite
                  </p>
                </div>
              </div>

              <div className="absolute right-[10%] top-[5%] flex h-14 w-14 animate-bounce items-center justify-center rounded-2xl bg-white text-3xl shadow-lg">
                🍕
              </div>

              <div className="absolute bottom-[7%] left-[12%] flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-lg">
                🍔
              </div>
            </div>
          </div>
        </div>

        <div className="h-1.5 bg-gradient-to-r from-orange-400 via-rose-400 to-orange-300" />
      </section>

      {/* ================= CATEGORIES ================= */}
      <section className="container section py-12 sm:py-16">
        <div className="mb-8 text-center sm:mb-12">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-orange-600">
            <Sparkles size={15} />
            Explore Menu
          </span>

          <SectionTitle
            title="What's on your mind?"
            subtitle="Discover delicious dishes for every craving"
          />
        </div>

        {uniqueCategories.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
            {uniqueCategories.map((category, index) => (
              <Link
                to={`/restaurants?category=${encodeURIComponent(category.name)}`}
                key={category._id || category.id || category.name}
                style={{ animationDelay: `${index * 100}ms` }}
                className="group relative isolate flex min-h-[190px] flex-col items-center justify-center overflow-hidden rounded-3xl border border-orange-100/80 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-5 text-center shadow-sm transition-all duration-300 ease-out hover:-translate-y-2 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-100/70 animate-[fadeUp_0.6s_ease_both]"
              >
                <div className="absolute -right-8 -top-8 -z-10 h-28 w-28 rounded-full bg-orange-200/40 blur-2xl transition-all duration-500 group-hover:scale-150 group-hover:bg-orange-300/50" />

                <div className="absolute right-3 top-3 rounded-full bg-white/80 p-2 text-orange-400 shadow-sm transition-all duration-300 group-hover:rotate-45 group-hover:bg-orange-500 group-hover:text-white">
                  <ArrowUpRight size={16} />
                </div>

                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white text-5xl shadow-md shadow-orange-100 ring-1 ring-orange-100 transition-all duration-300 group-hover:-rotate-6 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-orange-200/70">
                  {category.emoji || "🍽️"}
                </div>

                <h3 className="text-base font-extrabold capitalize text-slate-800 transition-colors duration-300 group-hover:text-orange-600 sm:text-lg">
                  {category.name}
                </h3>

                <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-slate-400 transition-all duration-300 group-hover:gap-2 group-hover:text-orange-500">
                  Explore dishes
                  <ArrowRight size={13} />
                </div>

                <div className="absolute bottom-0 left-1/2 h-1 w-0 -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-400 to-amber-400 transition-all duration-300 group-hover:w-1/2" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-8 text-center text-gray-500">
            No categories available right now.
          </p>
        )}
      </section>

      {/* ================= POPULAR RESTAURANTS ================= */}
      <section className="section light-section">
        <div className="container">
          <SectionTitle
            title="Popular restaurants"
            subtitle="Top-rated restaurants near you"
            link="/restaurants"
          />

          {restaurants.length > 0 ? (
            <div className="restaurant-grid">
              {restaurants.map((restaurant) => (
                <RestaurantCard
                  key={restaurant._id || restaurant.id}
                  restaurant={restaurant}
                />
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-gray-500">
              No restaurants available right now.
            </p>
          )}
        </div>
      </section>

      {/* ================= POPULAR DISHES ================= */}
      <section className="container section">
        <SectionTitle
          title="Popular dishes"
          subtitle="Customer favorites you'll love"
        />

        {/* Veg / Non-Veg filter */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Choose your food preference
          </p>

          <div className="flex w-fit items-center gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm">
            {/* All */}
            <button
              type="button"
              onClick={() => setFoodType("All")}
              aria-pressed={foodType === "All"}
              className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
                foodType === "All"
                  ? "bg-gray-800 text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100"
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
                  : "text-gray-600 hover:bg-green-50"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center border-2 border-green-600">
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
                  : "text-gray-600 hover:bg-red-50"
              }`}
            >
              <span className="flex h-4 w-4 items-center justify-center border-2 border-red-600">
                <span className="h-2 w-2 rounded-full bg-red-600" />
              </span>
              Non-Veg
            </button>
          </div>
        </div>

        {/* Food cards */}
        {foodLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange-100 border-t-orange-500" />
          </div>
        ) : filteredFoods.length > 0 ? (
          <div className="food-grid">
            {filteredFoods.slice(0, 4).map((food) => (
              <FoodCard
                key={food._id || food.id}
                food={food}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
            <div className="text-4xl">🍽️</div>

            <h3 className="mt-3 text-lg font-bold text-gray-800">
              No {foodType === "All" ? "" : `${foodType} `}dishes found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another food preference.
            </p>

            {foodType !== "All" && (
              <button
                type="button"
                onClick={() => setFoodType("All")}
                className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
              >
                Show all dishes
              </button>
            )}
          </div>
        )}
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container features-section">
        <div className="feature">
          <Clock3 />
          <div>
            <b>Fast delivery</b>
            <p>Hot food at your doorstep.</p>
          </div>
        </div>

        <div className="feature">
          <ShieldCheck />
          <div>
            <b>Safe & secure</b>
            <p>100% secure payments.</p>
          </div>
        </div>

        <div className="feature">
          <Tag />
          <div>
            <b>Best offers</b>
            <p>Save more on every order.</p>
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="cta container">
        <div>
          <span className="eyebrow">HUNGRY?</span>
          <h2>Get your favorites delivered.</h2>
          <p>
            Discover restaurants and order in just a few clicks.
          </p>
        </div>

        <Link className="primary-btn" to="/restaurants">
          Explore restaurants
          <ArrowRight size={18} />
        </Link>
      </section>
    </>
  );
}