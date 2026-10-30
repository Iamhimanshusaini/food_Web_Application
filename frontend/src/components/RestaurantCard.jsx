
import { Link } from "react-router-dom";
import {
  Clock,
  MapPin,
  Star,
  ArrowUpRight,
  Store,
} from "lucide-react";

export default function RestaurantCard({ restaurant }) {
  const isOpen = restaurant.isOpen === true;
  const closingTime= restaurant.closingTime

  return (
    <>
      <Link
        to={`/restaurant/${restaurant._id}`}
      >
        <article
          className={`group relative overflow-hidden rounded-3xl border bg-white shadow-sm transition-all duration-300 ${isOpen
              ? "border-slate-100 hover:-translate-y-2 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-100/60"
              : "cursor-not-allowed border-slate-200 opacity-90"
            }`}
        >
          {/* Restaurant Image */}
          <div className="relative h-52 overflow-hidden sm:h-60">
            <img
              src={restaurant.image || "/placeholder-food.png"}
              alt={restaurant.name}
              loading="lazy"
              className={`h-full w-full object-cover transition-transform duration-700 ${isOpen ? "group-hover:scale-110" : "grayscale"
                }`}
            />

            {/* Image Overlay */}
            <div
              className={`absolute inset-0 ${isOpen
                  ? "bg-gradient-to-t from-black/40 via-transparent to-black/10"
                  : "bg-black/55"
                }`}
            />

            {/* Closed Badge */}
            {!isOpen && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <Store size={28} />
                </span>

                <span className="rounded-full bg-red-600 px-5 py-2 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg">
                  Restaurant Closed
                </span>
              </div>
            )}

            {/* Open Badge */}
            {isOpen && (
              <span className="absolute left-4 top-4 rounded-full bg-green-500 px-3.5 py-2 text-xs font-extrabold text-white shadow-lg">
                ● Open Now
              </span>
            )}

            {/* Offer Badge */}
            {isOpen && restaurant.offer && (
              <span className="absolute left-4 top-16 rounded-full bg-orange-500 px-3.5 py-2 text-xs font-extrabold text-white shadow-lg">
                🔥 {restaurant.offer}
              </span>
            )}

            {/* Rating */}
            <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-xl bg-white/95 px-3 py-2 text-sm font-bold text-slate-800 shadow-lg">
              <Star size={15} className="fill-amber-400 text-amber-400" />
              {restaurant.rating ?? "New"}
            </div>

            {/* Arrow only when open */}
            {isOpen && (
              <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-700 opacity-0 shadow-md transition-all duration-300 group-hover:rotate-45 group-hover:opacity-100">
                <ArrowUpRight size={18} />
              </div>
            )}
          </div>

          {/* Restaurant Details */}
          <div className="p-5 sm:p-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3
                className={`line-clamp-1 text-lg font-extrabold sm:text-xl ${isOpen
                    ? "text-slate-800 group-hover:text-orange-600"
                    : "text-slate-500"
                  }`}
              >
                {restaurant.name}
              </h3>
            </div>

            {/* Delivery Time & Location */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-slate-500">
              <span
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold ${isOpen
                    ? "bg-orange-50 text-orange-600"
                    : "bg-slate-100 text-slate-400"
                  }`}
              >
                <Clock size={15} />
                {restaurant.deliveryTime || "30–40 min"}
              </span>

              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin size={16} className="shrink-0 text-slate-400" />
                <span className="line-clamp-1">
                  {restaurant.location || "Location unavailable"}
                </span>
              </span>
            </div>

            {/* Bottom Action */}
            <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
              {isOpen ? (
                <>
                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    className="text-sm font-bold text-slate-600 transition-colors hover:text-orange-600"
                  >
                    Explore restaurant
                  </Link>

                  <Link
                    to={`/restaurant/${restaurant._id}`}
                    aria-label="Explore restaurant"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-50 text-orange-500 transition-all hover:bg-orange-500 hover:text-white"
                  >
                    <ArrowUpRight size={18} />
                  </Link>
                </>
              ) : (
                <>
                  <span className="text-sm font-bold text-red-500">
                    Currently not accepting orders
                  </span>

                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Store size={18} />
                  </span>
                </>
              )}
            </div>
          </div>
        </article>
      </Link>
    </>

  );
}
