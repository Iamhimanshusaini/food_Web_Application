import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

import RestaurantCard from "../components/RestaurantCard";
import FoodCard from "../components/FoodCard";
import API from "../api/api";

export default function Restaurants() {
  const [categories, setCategories] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);

  const [params, setParams] = useSearchParams();

  const initialSearch = params.get("search") || "";
  const initialCategory = params.get("category") || "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] =
    useState(initialCategory || "All");

  const [foodType, setFoodType] = useState("All");
  const [sort, setSort] = useState("rating");
  const [loading, setLoading] = useState(true);

  // Fetch restaurants, categories and foods from backend
  useEffect(() => {
    const getFetchData = async () => {
      try {
        setLoading(true);

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
        setLoading(false);
      }
    };

    getFetchData();
  }, []);

  // Sync search and category when URL query changes
  useEffect(() => {
    setSearch(params.get("search") || "");
    setSelectedCategory(params.get("category") || "All");
  }, [params]);

  // Remove duplicate category names
  const uniqueCategories = useMemo(() => {
    const categoryMap = new Map();

    categories.forEach((item) => {
      const name = String(item.name || "").trim();

      if (!name) return;

      const key = name.toLowerCase();

      if (!categoryMap.has(key)) {
        categoryMap.set(key, { ...item, name });
      }
    });

    return Array.from(categoryMap.values());
  }, [categories]);

  // Update URL when a category is selected
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);

    const nextParams = new URLSearchParams(params);

    if (categoryName === "All") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", categoryName);
    }

    setParams(nextParams);
  };

  // Filter and sort restaurants
  const filteredRestaurants = useMemo(() => {
    const query = search.trim().toLowerCase();

    const data = restaurants.filter((restaurant) => {
      const cuisines = Array.isArray(restaurant.cuisine)
        ? restaurant.cuisine.join(" ")
        : restaurant.cuisine || "";

      const restaurantText =
        `${restaurant.name || ""} ${cuisines}`.toLowerCase();

      const matchesSearch =
        !query || restaurantText.includes(query);

      // Show all restaurants when category or food search
      // does not match restaurant name/cuisine.
      return matchesSearch;
    });

    return [...data].sort((a, b) => {
      if (sort === "rating") {
        return Number(b.rating || 0) - Number(a.rating || 0);
      }

      if (sort === "delivery") {
        const timeA = parseInt(a.deliveryTime, 10) || 999;
        const timeB = parseInt(b.deliveryTime, 10) || 999;

        return timeA - timeB;
      }

      return 0;
    });
  }, [restaurants, search, sort]);

  // Filter food items
  const filteredFoods = useMemo(() => {
    const query = search.trim().toLowerCase();

    return foods.filter((food) => {
      const foodName = String(food.name || "").toLowerCase();

      const categoryName = String(
        food.categoryName || food.category || ""
      );

      const foodCategory = categoryName.toLowerCase();

      const description = String(
        food.description || ""
      ).toLowerCase();

      const restaurantId = String(
        food.restaurantId?._id || food.restaurantId || ""
      );

      const matchingRestaurant = restaurants.find(
        (restaurant) => String(restaurant._id || restaurant.id) === restaurantId
      );

      const restaurantName = String(
        matchingRestaurant?.name || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        foodName.includes(query) ||
        foodCategory.includes(query) ||
        description.includes(query) ||
        restaurantName.includes(query);

      const matchesCategory =
        selectedCategory === "All" ||
        foodCategory === selectedCategory.toLowerCase();

      const currentFoodType = String(
        food.foodType || (food.veg === true ? "Veg" : "")
      )
        .trim()
        .toLowerCase();

      const matchesFoodType =
        foodType === "All" ||
        currentFoodType === foodType.toLowerCase();

      return (
        matchesSearch &&
        matchesCategory &&
        matchesFoodType
      );
    });
  }, [foods, search, selectedCategory, foodType, restaurants]);

  return (
    <div className="container page">
      {/* Page heading */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">DISCOVER</span>

          <h1>Restaurants &amp; food</h1>

          <p>
            Find something delicious for every craving.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar-large">
        <Search />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search restaurants, dishes or cuisines..."
          aria-label="Search restaurants and food"
        />
      </div>

      {/* Filters */}
      <div className="filter-row">
        {/* Category pills */}
        <div className="category-pills">
          <button
            type="button"
            className={selectedCategory === "All" ? "selected" : ""}
            onClick={() => handleCategoryChange("All")}
          >
            All
          </button>

          {uniqueCategories.map((category) => (
            <button
              type="button"
              key={category._id || category.id || category.name}
              className={
                selectedCategory.toLowerCase() ===
                category.name.toLowerCase()
                  ? "selected"
                  : ""
              }
              onClick={() => handleCategoryChange(category.name)}
            >
              {category.emoji || "🍽️"} {category.name}
            </button>
          ))}
        </div>

        {/* Sorting */}
        <div className="filters">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            aria-label="Sort restaurants"
          >
            <option value="rating">Top rated</option>
            <option value="delivery">Fast delivery</option>
          </select>

          <SlidersHorizontal size={18} />
        </div>
      </div>

      {/* Veg / Non-Veg toggle */}
      <div className="my-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div>
          <h3 className="font-bold text-gray-900">
            Food preference
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Choose your preferred food type.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => setFoodType("All")}
            aria-pressed={foodType === "All"}
            className={`rounded-lg px-4 py-2.5 text-sm font-bold transition ${
              foodType === "All"
                ? "bg-gray-800 text-white"
                : "text-gray-600 hover:bg-white"
            }`}
          >
            All
          </button>

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
            <span className="flex h-4 w-4 items-center justify-center border-2 border-green-600">
              <span className="h-2 w-2 rounded-full bg-green-600" />
            </span>
            Veg
          </button>

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
            <span className="flex h-4 w-4 items-center justify-center border-2 border-red-600">
              <span className="h-2 w-2 rounded-full bg-red-600" />
            </span>
            Non-Veg
          </button>
        </div>
      </div>

      {/* Restaurants list */}
      <h2 className="list-heading">
        Restaurants
        <span>{filteredRestaurants.length}</span>
      </h2>

      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading restaurants...
        </div>
      ) : filteredRestaurants.length > 0 ? (
        <div className="restaurant-grid">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id || restaurant.id}
              restaurant={restaurant}
            />
          ))}
        </div>
      ) : (
        <p className="py-8 text-center text-gray-500">
          No restaurants found.
        </p>
      )}

      {/* Food list */}
      <h2 className="list-heading dishes-heading">
        Popular dishes
        <span>{filteredFoods.length}</span>
      </h2>

      {loading ? (
        <div className="py-10 text-center text-gray-500">
          Loading dishes...
        </div>
      ) : filteredFoods.length > 0 ? (
        <div className="food-grid">
          {filteredFoods.map((food) => (
            <FoodCard
              key={food._id || food.id}
              food={food}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <div className="text-4xl">🍽️</div>

          <h3 className="mt-3 font-bold text-gray-800">
            No dishes found
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Try changing the category, search term or food preference.
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setFoodType("All");
              handleCategoryChange("All");
            }}
            className="mt-4 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-orange-600"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}