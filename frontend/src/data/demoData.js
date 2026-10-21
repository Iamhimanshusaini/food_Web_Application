export const categories = [
  { id: 1, name: "Pizza", emoji: "🍕" },
  { id: 2, name: "Burger", emoji: "🍔" },
  { id: 3, name: "Biryani", emoji: "🍛" },
  { id: 4, name: "Chinese", emoji: "🍜" },
  { id: 5, name: "South Indian", emoji: "🥘" },
  { id: 6, name: "Desserts", emoji: "🍰" },
  { id: 7, name: "Rolls", emoji: "🌯" },
  { id: 8, name: "Healthy", emoji: "🥗" }
];

export const restaurants = [
  {
    id: "r1",
    name: "Spice Garden",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
    cuisine: ["North Indian", "Biryani", "Chinese"],
    rating: 4.7,
    deliveryTime: "25-30 min",
    deliveryFee: 30,
    offer: "20% OFF up to ₹100",
    location: "Civil Lines"
  },
  {
    id: "r2",
    name: "The Burger House",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=900&q=80",
    cuisine: ["Burgers", "Fast Food", "Fries"],
    rating: 4.5,
    deliveryTime: "20-25 min",
    deliveryFee: 20,
    offer: "Flat ₹75 OFF",
    location: "Model Town"
  },
  {
    id: "r3",
    name: "Pizza Craft",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",
    cuisine: ["Pizza", "Italian", "Pasta"],
    rating: 4.6,
    deliveryTime: "25-35 min",
    deliveryFee: 25,
    offer: "Buy 1 Get 1",
    location: "Rajendra Nagar"
  },
  {
    id: "r4",
    name: "Wok Express",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    cuisine: ["Chinese", "Asian", "Noodles"],
    rating: 4.4,
    deliveryTime: "30-35 min",
    deliveryFee: 35,
    offer: "30% OFF",
    location: "Gandhi Nagar"
  }
];

export const foods = [
  {
    id: "f1", restaurantId: "r1", name: "Chicken Biryani", category: "Biryani",
    price: 249, rating: 4.8, veg: false,
    image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=700&q=80",
    description: "Aromatic basmati rice cooked with tender chicken and fragrant spices."
  },
  {
    id: "f2", restaurantId: "r1", name: "Paneer Butter Masala", category: "North Indian",
    price: 219, rating: 4.6, veg: true,
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&w=700&q=80",
    description: "Soft paneer cubes in a creamy tomato and butter gravy."
  },
  {
    id: "f3", restaurantId: "r1", name: "Veg Hakka Noodles", category: "Chinese",
    price: 169, rating: 4.4, veg: true,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=700&q=80",
    description: "Stir-fried noodles tossed with fresh vegetables and sauces."
  },
  {
    id: "f4", restaurantId: "r2", name: "Classic Chicken Burger", category: "Burger",
    price: 199, rating: 4.7, veg: false,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=700&q=80",
    description: "Crispy chicken patty, fresh lettuce, cheese and house sauce."
  },
  {
    id: "f5", restaurantId: "r2", name: "Cheese Loaded Fries", category: "Fast Food",
    price: 149, rating: 4.5, veg: true,
    image: "https://images.unsplash.com/photo-1585109649139-366815a0d713?auto=format&fit=crop&w=700&q=80",
    description: "Crispy golden fries topped with creamy cheese sauce."
  },
  {
    id: "f6", restaurantId: "r3", name: "Margherita Pizza", category: "Pizza",
    price: 299, rating: 4.7, veg: true,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=700&q=80",
    description: "Classic pizza with tomato sauce, mozzarella and basil."
  },
  {
    id: "f7", restaurantId: "r3", name: "Farmhouse Pizza", category: "Pizza",
    price: 349, rating: 4.8, veg: true,
    image: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?auto=format&fit=crop&w=700&q=80",
    description: "Loaded with fresh capsicum, onion, tomato, corn and cheese."
  },
  {
    id: "f8", restaurantId: "r4", name: "Chicken Chowmein", category: "Chinese",
    price: 229, rating: 4.5, veg: false,
    image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=700&q=80",
    description: "Wok-tossed noodles with chicken, vegetables and Asian sauces."
  }
];

export const sampleOrders = [
  {
    id: "ORD10245",
    restaurant: "Spice Garden",
    items: [{ name: "Chicken Biryani", quantity: 2, price: 249 }],
    total: 528,
    status: "Delivered",
    date: "06 Oct 2026",
    payment: "Online"
  },
  {
    id: "ORD10231",
    restaurant: "Pizza Craft",
    items: [{ name: "Margherita Pizza", quantity: 1, price: 299 }],
    total: 324,
    status: "On the way",
    date: "04 Oct 2026",
    payment: "Online"
  }
];