import { useMemo, useState } from "react";
import {
  LayoutDashboard,
  Store,
  ClipboardList,
  Users,
  Star,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  MoreHorizontal,
  SlidersHorizontal,
  ArrowUpRight,
  Utensils,
  LogOut,
  MapPin,
  CalendarDays,
} from "lucide-react";

const initialRestaurants = [
  {
    id: 1,
    name: "Spice Garden",
    owner: "Amit Sharma",
    email: "amit@example.com",
    category: "Indian",
    location: "Saharanpur",
    orders: 1248,
    rating: 4.8,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100",
    joined: "12 Oct 2026",
  },
  {
    id: 2,
    name: "Burger House",
    owner: "Rahul Verma",
    email: "rahul@example.com",
    category: "Fast Food",
    location: "Meerut",
    orders: 856,
    rating: 4.6,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100",
    joined: "10 Oct 2026",
  },
  {
    id: 3,
    name: "Pizza Palace",
    owner: "Neha Singh",
    email: "neha@example.com",
    category: "Pizza",
    location: "Noida",
    orders: 0,
    rating: 0,
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100",
    joined: "15 Oct 2026",
  },
  {
    id: 4,
    name: "Green Bowl",
    owner: "Priya Gupta",
    email: "priya@example.com",
    category: "Healthy Food",
    location: "Delhi",
    orders: 642,
    rating: 4.7,
    status: "Approved",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=100",
    joined: "08 Oct 2026",
  },
  {
    id: 5,
    name: "Wok & Roll",
    owner: "Karan Malhotra",
    email: "karan@example.com",
    category: "Chinese",
    location: "Ghaziabad",
    orders: 0,
    rating: 0,
    status: "Pending",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=100",
    joined: "14 Oct 2026",
  },
  {
    id: 6,
    name: "Royal Biryani",
    owner: "Mohit Kumar",
    email: "mohit@example.com",
    category: "Biryani",
    location: "Lucknow",
    orders: 934,
    rating: 4.9,
    status: "Rejected",
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d51a?w=100",
    joined: "07 Oct 2026",
  },
];

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Restaurants", icon: Store },
  { label: "Approvals", icon: ClipboardList },
  { label: "Orders", icon: ShoppingBag },
  { label: "Customers", icon: Users },
  { label: "Reviews", icon: Star },
  { label: "Settings", icon: Settings },
];

const money = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

function StatusBadge({ status }) {
  const styles = {
    Approved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
    Rejected: "bg-red-50 text-red-700 ring-red-600/20",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${
        styles[status] || styles.Pending
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function StatCard({
  title,
  value,
  change,
  positive = true,
  icon: Icon,
  iconColor,
  iconBg,
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </h3>
        </div>
        <div className={`rounded-xl p-3 ${iconBg} ${iconColor}`}>
          <Icon size={21} />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className={`inline-flex items-center gap-1 rounded-md px-1.5 py-1 font-semibold ${
            positive
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {positive ? (
            <TrendingUp size={13} />
          ) : (
            <TrendingDown size={13} />
          )}
          {change}
        </span>
        <span className="text-slate-400">vs last month</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [notification, setNotification] = useState("");

  const pendingCount = restaurants.filter(
    (restaurant) => restaurant.status === "Pending"
  ).length;

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter((restaurant) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        restaurant.name.toLowerCase().includes(searchText) ||
        restaurant.owner.toLowerCase().includes(searchText) ||
        restaurant.category.toLowerCase().includes(searchText) ||
        restaurant.location.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || restaurant.status === statusFilter;

      const matchesPage =
        activePage !== "Approvals" || restaurant.status === "Pending";

      return matchesSearch && matchesStatus && matchesPage;
    });
  }, [restaurants, search, statusFilter, activePage]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 3000);
  };

  const updateStatus = (id, status) => {
    setRestaurants((previous) =>
      previous.map((restaurant) =>
        restaurant.id === id ? { ...restaurant, status } : restaurant
      )
    );

    setSelectedRestaurant(null);
    showNotification(`Restaurant ${status.toLowerCase()} successfully.`);
  };

  const handleNavigation = (page) => {
    setActivePage(page);
    setSearch("");
    setStatusFilter(page === "Approvals" ? "Pending" : "All");
    setMobileMenu(false);
  };

  const pageTitle =
    activePage === "Overview"
      ? "Restaurant Management"
      : activePage === "Approvals"
        ? "Restaurant Approvals"
        : activePage;

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-800">
      {/* Mobile sidebar backdrop */}
      {mobileMenu && (
        <button
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
          onClick={() => setMobileMenu(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileMenu ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-slate-100 px-6">
          <button
            className="flex items-center gap-3"
            onClick={() => handleNavigation("Overview")}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-200">
              <Utensils size={22} />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                foodly<span className="text-orange-500">.</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                Admin panel
              </p>
            </div>
          </button>
          <button
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 lg:hidden"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigation.map(({ label, icon: Icon }) => {
              const active = activePage === label;

              return (
                <button
                  key={label}
                  onClick={() => handleNavigation(label)}
                  className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon
                      size={19}
                      className={
                        active
                          ? "text-orange-500"
                          : "text-slate-400 group-hover:text-slate-700"
                      }
                    />
                    {label}
                  </span>

                  {label === "Approvals" && pendingCount > 0 && (
                    <span className="rounded-lg bg-orange-500 px-2 py-0.5 text-[11px] font-bold text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4">
          <div className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 p-4 text-white">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
              <Store size={19} />
            </div>
            <p className="text-sm font-bold">Restaurant network</p>
            <p className="mt-1 text-xs leading-5 text-orange-50">
              Keep track of your restaurants and grow your food business.
            </p>
            <button
              onClick={() => handleNavigation("Restaurants")}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-xs font-bold text-orange-600 transition hover:bg-orange-50"
            >
              Manage restaurants <ArrowUpRight size={14} />
            </button>
          </div>

          <button
            onClick={() => showNotification("Connect your logout API here.")}
            className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="min-h-screen lg:ml-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-100 bg-white/95 px-4 backdrop-blur sm:px-7 lg:px-9">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-600 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs font-medium text-slate-400">
                Admin / {activePage}
              </p>
              <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
                {pageTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500 md:flex">
              <CalendarDays size={15} />
              <span>October 2026</span>
              <ChevronDown size={14} />
            </div>

            <button
              onClick={() => handleNavigation("Approvals")}
              className="relative rounded-xl border border-slate-100 p-2.5 text-slate-500 transition hover:bg-orange-50 hover:text-orange-600"
              aria-label="Notifications"
            >
              <Bell size={19} />
              {pendingCount > 0 && (
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-orange-500" />
              )}
            </button>

            <div className="hidden h-8 w-px bg-slate-200 sm:block" />

            <button className="flex items-center gap-2.5 text-left">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-700 ring-2 ring-orange-50">
                AD
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-400">Super Admin</p>
              </div>
              <ChevronDown size={15} className="hidden text-slate-400 sm:block" />
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-[1600px] space-y-7 p-4 sm:p-7 lg:p-9">
          {/* Welcome */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm text-slate-500">
                Welcome back, Admin 👋
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {activePage === "Overview"
                  ? "Here's your business overview"
                  : `Manage ${activePage.toLowerCase()}`}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Here's what's happening with your food delivery platform.
              </p>
            </div>

            <button
              onClick={() => handleNavigation("Approvals")}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-100 transition hover:bg-orange-600"
            >
              <ClipboardList size={17} />
              Review applications
              {pendingCount > 0 && (
                <span className="rounded-md bg-white/20 px-1.5 py-0.5 text-xs">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>

          {/* Stats */}
          {activePage === "Overview" && (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  title="Total restaurants"
                  value={restaurants.length.toString().padStart(2, "0")}
                  change="+12.8%"
                  icon={Store}
                  iconBg="bg-orange-50"
                  iconColor="text-orange-500"
                />
                <StatCard
                  title="Pending approvals"
                  value={pendingCount.toString().padStart(2, "0")}
                  change={`${pendingCount} awaiting`}
                  positive={false}
                  icon={Clock}
                  iconBg="bg-amber-50"
                  iconColor="text-amber-500"
                />
                <StatCard
                  title="Total orders"
                  value="12,840"
                  change="+18.2%"
                  icon={ShoppingBag}
                  iconBg="bg-blue-50"
                  iconColor="text-blue-500"
                />
                <StatCard
                  title="Total revenue"
                  value={money(842650)}
                  change="+9.4%"
                  icon={IndianRupee}
                  iconBg="bg-emerald-50"
                  iconColor="text-emerald-500"
                />
              </div>

              {/* Banner */}
              <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
                <div className="relative z-10 max-w-xl">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-orange-200">
                    <span className="h-2 w-2 rounded-full bg-orange-400" />
                    Your platform at a glance
                  </span>
                  <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                    Great food brings
                    <br />
                    people together.
                  </h2>
                  <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
                    Review new restaurant applications, monitor performance,
                    and help customers discover their next favourite meal.
                  </p>
                  <button
                    onClick={() => handleNavigation("Restaurants")}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-semibold transition hover:bg-orange-400"
                  >
                    Explore restaurants <ArrowUpRight size={17} />
                  </button>
                </div>
                <div className="pointer-events-none absolute -right-10 -top-20 h-72 w-72 rounded-full border-[40px] border-white/5" />
                <div className="pointer-events-none absolute -bottom-36 right-28 h-72 w-72 rounded-full bg-orange-500/20 blur-3xl" />
                <Utensils className="pointer-events-none absolute bottom-7 right-10 hidden h-32 w-32 rotate-12 text-white/10 sm:block" />
              </div>
            </>
          )}

          {/* Restaurant directory */}
          {(activePage === "Overview" ||
            activePage === "Restaurants" ||
            activePage === "Approvals") && (
            <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
              <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {activePage === "Approvals"
                      ? "Pending applications"
                      : "Restaurant directory"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {activePage === "Approvals"
                      ? "Review and manage restaurant registration requests."
                      : "View, search and manage restaurants on your platform."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search restaurants..."
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-orange-400 focus:ring-4 focus:ring-orange-50 sm:w-56"
                    />
                  </div>

                  <div className="relative">
                    <SlidersHorizontal
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-orange-400 sm:w-40"
                    >
                      <option value="All">All statuses</option>
                      <option value="Approved">Approved</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[920px] text-left">
                  <thead className="bg-slate-50/80">
                    <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <th className="px-6 py-4">Restaurant</th>
                      <th className="px-5 py-4">Owner</th>
                      <th className="px-5 py-4">Category</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Orders</th>
                      <th className="px-5 py-4">Rating</th>
                      <th className="px-5 py-4 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRestaurants.map((restaurant) => (
                      <tr
                        key={restaurant.id}
                        className="transition hover:bg-orange-50/30"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={restaurant.image}
                              alt={restaurant.name}
                              className="h-12 w-12 rounded-xl object-cover"
                            />
                            <div>
                              <p className="font-semibold text-slate-800">
                                {restaurant.name}
                              </p>
                              <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                <MapPin size={12} />
                                {restaurant.location}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-700">
                            {restaurant.owner}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {restaurant.email}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-medium text-slate-600">
                            {restaurant.category}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={restaurant.status} />
                        </td>

                        <td className="px-5 py-4 text-sm font-semibold text-slate-700">
                          {restaurant.orders.toLocaleString("en-IN")}
                        </td>

                        <td className="px-5 py-4">
                          {restaurant.rating > 0 ? (
                            <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700">
                              <Star
                                size={15}
                                className="fill-amber-400 text-amber-400"
                              />
                              {restaurant.rating.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">
                              No ratings
                            </span>
                          )}
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              title="View details"
                              onClick={() =>
                                setSelectedRestaurant(restaurant)
                              }
                              className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600"
                            >
                              <Eye size={16} />
                            </button>

                            {restaurant.status === "Pending" && (
                              <>
                                <button
                                  title="Approve restaurant"
                                  onClick={() =>
                                    updateStatus(restaurant.id, "Approved")
                                  }
                                  className="rounded-lg bg-emerald-50 p-2 text-emerald-600 transition hover:bg-emerald-100"
                                >
                                  <CheckCircle2 size={17} />
                                </button>
                                <button
                                  title="Reject restaurant"
                                  onClick={() =>
                                    updateStatus(restaurant.id, "Rejected")
                                  }
                                  className="rounded-lg bg-red-50 p-2 text-red-600 transition hover:bg-red-100"
                                >
                                  <XCircle size={17} />
                                </button>
                              </>
                            )}

                            {restaurant.status !== "Pending" && (
                              <button
                                title="More actions"
                                onClick={() =>
                                  setSelectedRestaurant(restaurant)
                                }
                                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100"
                              >
                                <MoreHorizontal size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredRestaurants.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                            <Store size={23} />
                          </div>
                          <p className="mt-3 font-semibold text-slate-700">
                            No restaurants found
                          </p>
                          <p className="mt-1 text-sm text-slate-400">
                            Try changing your search or status filter.
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-slate-700">
                    {filteredRestaurants.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700">
                    {restaurants.length}
                  </span>{" "}
                  restaurants
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-400"
                  >
                    Previous
                  </button>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-500 text-xs font-bold text-white">
                    1
                  </span>
                  <button
                    disabled
                    className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-400"
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* Other navigation placeholders */}
          {["Orders", "Customers", "Reviews", "Settings"].includes(
            activePage
          ) && (
            <section className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm sm:p-14">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                {activePage === "Orders" && <ShoppingBag size={28} />}
                {activePage === "Customers" && <Users size={28} />}
                {activePage === "Reviews" && <Star size={28} />}
                {activePage === "Settings" && <Settings size={28} />}
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                {activePage} management
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                This section is ready for your {activePage.toLowerCase()} UI.
                Connect your backend API to display real data here.
              </p>
              <button
                onClick={() => handleNavigation("Overview")}
                className="mt-6 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Back to overview
              </button>
            </section>
          )}

          <footer className="flex flex-col justify-between gap-2 pb-2 text-xs text-slate-400 sm:flex-row">
            <p>© 2026 Foodly Admin. All rights reserved.</p>
            <p>Restaurant management dashboard · Demo version</p>
          </footer>
        </main>
      </div>

      {/* Restaurant details modal */}
      {selectedRestaurant && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedRestaurant(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-36 bg-slate-100">
              <img
                src={selectedRestaurant.image}
                alt={selectedRestaurant.name}
                className="h-full w-full object-cover"
              />
              <button
                onClick={() => setSelectedRestaurant(null)}
                className="absolute right-3 top-3 rounded-xl bg-white/90 p-2 text-slate-600 hover:bg-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {selectedRestaurant.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedRestaurant.category} ·{" "}
                    {selectedRestaurant.location}
                  </p>
                </div>
                <StatusBadge status={selectedRestaurant.status} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Restaurant owner</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedRestaurant.owner}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Total orders</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedRestaurant.orders.toLocaleString("en-IN")}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Email</p>
                  <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                    {selectedRestaurant.email}
                  </p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Registration date</p>
                  <p className="mt-1 font-semibold text-slate-800">
                    {selectedRestaurant.joined}
                  </p>
                </div>
              </div>

              {selectedRestaurant.status === "Pending" ? (
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() =>
                      updateStatus(selectedRestaurant.id, "Rejected")
                    }
                    className="flex-1 rounded-xl border border-red-200 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() =>
                      updateStatus(selectedRestaurant.id, "Approved")
                    }
                    className="flex-1 rounded-xl bg-orange-500 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Approve restaurant
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedRestaurant(null)}
                  className="mt-6 w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Close details
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 rounded-xl bg-slate-900 px-5 py-4 text-sm font-medium text-white shadow-2xl">
          <CheckCircle2 size={19} className="shrink-0 text-emerald-400" />
          {notification}
          <button
            onClick={() => setNotification("")}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}