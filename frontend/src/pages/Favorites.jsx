import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { restaurants } from "../data/demoData";
import RestaurantCard from "../components/RestaurantCard";

export default function Favorites() {
  return <div className="container page"><div className="page-heading"><span className="eyebrow">YOUR PICKS</span><h1>Favorites</h1><p>Restaurants you love.</p></div><div className="restaurant-grid">{restaurants.slice(0,2).map(r=><RestaurantCard key={r.id} restaurant={r}/>)}</div><div className="favorite-note"><Heart/> Favorite functionality is ready to connect with your backend.</div></div>;
}