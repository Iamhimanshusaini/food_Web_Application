import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader"
import { Pencil } from 'lucide-react'
import {
    LayoutDashboard,
    UtensilsCrossed,
    ShoppingBag,
    Tags,
    Plus,
    Trash2,
    Store,
    ShieldAlert,
    Menu,
    X,
    Clock,
    CheckCircle,
    Package,
    IndianRupee,
    ArrowRight,
    ChefHat,
    Search,
} from "lucide-react";
import axios from "axios";
import API from "../api/api";


export default function RestaurantManagement() {
    const { user, logout } = useAuth();
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [products, setProducts] = useState([])
    const [emoji, setEmoji] = useState('')
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [search, setSearch] = useState("");
    const [showForm, setShowForm] = useState(false)
    const [editIndex, setEditIndex] = useState(null)
    // Demo state: replace with API data
    const [categories, setCategories] = useState([]);
    // console.log(categories)

    const [orders, setOrders] = useState([]);

    const [message, setMessage] = useState("");

    // Check logged-in user's role and restaurant
    const isAdmin = user?.role === "restaurantOwner" && user.isApproved === true;
    const notApproval = user.isApproved === false;
    const restaurantId = user?.restaurantId
    // console.log(user)
    const notify = (text) => {
        setMessage(text);
        setTimeout(() => setMessage(""), 2500);
    };
    if (notApproval) {
        return (
            <AccessMessage
                title="Login required"
                description="your Restaurant Is not approval"
                buttonText="Please contact Administor"
                onClick={() => { navigate("/"), logout() }}
            />
        );
    }
    // Role check
    if (!user) {
        return (
            <AccessMessage
                title="Login required"
                description="Please log in to access restaurant management."
                buttonText="Go to login"
                onClick={() => navigate("/login")}
            />
        );
    }

    if (!isAdmin) {
        return (
            <AccessMessage
                title="Access denied"
                description="Only an authorized admin can access this dashboard."
                buttonText="Go to home"
                onClick={() => navigate("/")}
            />
        );
    }

    // Restaurant missing: show create restaurant page
    if (!restaurantId) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
                <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-8 text-center shadow-xl shadow-slate-200/50 sm:p-12">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-orange-100 text-orange-600">
                        <Store size={38} />
                    </div>

                    <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-orange-600">
                        Restaurant setup
                    </p>

                    <h1 className="mt-3 text-2xl font-extrabold text-slate-900 sm:text-3xl">
                        Create your restaurant
                    </h1>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500">
                        You don't have a restaurant linked to your account yet.
                        Create your restaurant to start managing products,
                        categories and incoming food orders.
                    </p>

                    <button
                        onClick={() => navigate("/restaurant/create")}
                        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3.5 font-semibold text-white shadow-lg shadow-orange-200 transition hover:bg-orange-600 sm:w-auto"
                    >
                        <Plus size={19} />
                        Create Restaurant
                        <ArrowRight size={17} />
                    </button>

                    <p className="mt-5 text-xs text-slate-400">
                        Your restaurant may need admin approval before going live.
                    </p>
                </div>
            </div>
        );
    }

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard },
        { name: "Categories", icon: Tags },
        { name: "Products", icon: UtensilsCrossed },
        { name: "Orders", icon: ShoppingBag },
    ];


    const getOrders = async () => {
        try {
            const res = await axios.get(`${API}/orders/restaurant`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setOrders(res.data.orders || []);
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
        }
    }
    console.log(orders)
    const addCategory = async (e) => {
        e.preventDefault();
        setLoading(true)
        if (!token) {
            setError("Please login first.");
            navigate("/login");
            return;
        }
        try {
            const res = await axios.post(`${API}/restaurant/category-create`,
                {
                    categoryName, emoji
                }
                ,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            notify(res.data.message)
            getCategoryByRetaId()
        } catch (error) {
            console.log(error)
            notify(error.response?.data?.message || "some thing went worng")
        } finally {
            setLoading(false)
        }

    }
    const getCategoryByRetaId = async (req, res) => {
        setLoading(true)
        try {
            const res = await axios.get(`${API}/restaurant/categories/category`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setCategories(res.data.restaurantCategory)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }
    useEffect(() => {
        if (token) {
            getCategoryByRetaId()
            getProductByRetaId()
            getOrders()
        }

    }, [token])
    const deleteCategory = async (id) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${API}/restaurant/categories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            notify(res.data.message)
            getCategoryByRetaId()
        } catch (error) {
            console.log(error)
            notify(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        image: "",
        categoryName: "",
        foodType: "veg",
        preparationTime: 25,
        servingSize: "Medium",
        stock: 50,
        isAvailable: true,
        isFeatured: false,
    });
    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            price: "",
            discountPrice: "",
            image: "",
            categoryName: "",
            foodType: "veg",
            preparationTime: 25,
            servingSize: "Medium",
            stock: 50,
            isAvailable: true,
            isFeatured: false,
        })
        setEditIndex(null)
        setShowForm(!showForm)
    }
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    const addProduct = async (e) => {
        e.preventDefault();
        setLoading(true)

        try {
            let res;

            if (editIndex) {
                res = await axios.put(`${API}/restaurant/product/update/${editIndex}`, formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
            } else {
                res = await axios.post(`${API}/restaurant/create-product`, formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
            }
            notify(res.data.message || (editIndex
                ? "Product updated successfully"
                : "Product added successfully"
            ));

            await getProductByRetaId();
            resetForm();
        } catch (error) {
            console.log(error)
            console.log(error.response?.data?.message)
            notify(error.response?.data?.message)
        } finally {
            setLoading(false)

        }
    };
    const getProductByRetaId = async (req, res) => {
        setLoading(true)
        try {
            const res = await axios.get(`${API}/restaurant/restaurant-products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setProducts(res.data.restaurantProduct)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }
    const UpdateHandle = (product, index) => {
        setFormData({
            name: product.name,
            description: product.description,
            price: product.price,
            discountPrice: product.discountPrice,
            image: product.image,
            categoryName: product.categoryName,
            foodType: product.foodType,
            preparationTime: product.preparationTime,
            servingSize: product.servingSize,
            stock: product.stock,
            isAvailable: true,
            isFeatured: false,
        })
        setEditIndex(product._id)
        setShowForm(true)
    }
    const deleteProduct = async (id) => {
        setLoading(true)
        try {
            const res = await axios.delete(`${API}/restaurant/product/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            notify(res.data.message)
            getProductByRetaId()
        } catch (error) {
            console.log(error)
            notify(error.response?.data?.message)
        } finally {
            setLoading(false)
        }
    };

    const updateOrderStatus = async (id, status) => {
        try {
            const res = await axios.put(
                `${API}/update-status/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (res.data.success) {
                notify(res.data.message);
                await getOrders();
            }
        } catch (error) {
            console.log(
                error.response?.data?.message || error.message
            );
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    const pendingOrders = orders.filter(
        (order) => order.orderStatus === "pending"
    ).length;
    console.log(pendingOrders)

    const pageTitle = {
        Dashboard: "Restaurant Dashboard",
        Categories: "Manage Categories",
        Products: "Manage Products",
        Orders: "Incoming Orders",
    }[activeTab];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {sidebarOpen && (
                <button
                    aria-label="Close sidebar"
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-100 bg-white transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-orange-500 p-2.5 text-white">
                            <ChefHat size={23} />
                        </div>
                        <div>
                            <h1 className="text-xl font-extrabold text-slate-900">
                                Foodly<span className="text-orange-500">.</span>
                            </h1>
                            <p className="text-xs text-slate-400">Restaurant panel</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-4 py-6">
                    <p className="mb-3 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                        Management
                    </p>

                    {menuItems.map(({ name, icon: Icon }) => (
                        <button
                            key={name}
                            onClick={() => {
                                setActiveTab(name);
                                setSidebarOpen(false);
                                setSearch("");
                            }}
                            className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === name
                                ? "bg-orange-50 text-orange-600"
                                : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                        >
                            <Icon size={19} />
                            {name}

                            {name === "Orders" && pendingOrders > 0 && (
                                <span className="ml-auto rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                                    {pendingOrders}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                <div className="mt-auto p-4">
                    <div className="rounded-2xl bg-orange-50 p-4">
                        <div className="flex items-center gap-2 text-orange-600">
                            <ShieldAlert size={18} />
                            <span className="text-sm font-bold">Restaurant ID</span>
                        </div>
                        <p className="mt-2 break-all text-xs text-slate-500">
                            {String(restaurantId)}
                        </p>
                    </div>

                    <button
                        onClick={() => {
                            logout()
                            navigate('/login')
                        }}
                        className="mt-4 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                    >
                        Log-Out
                    </button>
                </div>
            </aside>

            {/* Main */}
            <div className="min-h-screen lg:ml-64">
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-xl border border-slate-200 p-2 lg:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                {pageTitle}
                            </h2>
                            <p className="hidden text-xs text-slate-400 sm:block">
                                Manage your restaurant operations
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden text-right sm:block">
                            <p className="text-sm font-bold">
                                {user.name || user.fullName || "Admin"}
                            </p>
                            <p className="text-xs text-slate-400">Administrator</p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-orange-600">
                            {(user.name || user.fullName || "A")
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                    </div>
                </header>

                <main className="mx-auto max-w-7xl space-y-7 p-4 sm:p-8">
                    {/* Dashboard overview */}
                    {activeTab === "Dashboard" && (
                        <>
                            <div>
                                <h1 className="text-2xl font-extrabold text-slate-900">
                                    Welcome back, {user.name || user.fullName || "Admin"}!
                                </h1>
                                <p className="mt-2 text-sm text-slate-500">
                                    Here is your restaurant's current overview.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                <Stat
                                    title="Categories"
                                    value={categories.length}
                                    icon={Tags}
                                    color="orange"
                                />
                                <Stat
                                    title="Products"
                                    value={products.length}
                                    icon={Package}
                                    color="blue"
                                />
                                <Stat
                                    title="Total Orders"
                                    value={orders.length}
                                    icon={ShoppingBag}
                                    color="purple"
                                />
                                <Stat
                                    title="Pending Orders"
                                    value={pendingOrders}
                                    icon={Clock}
                                    color="green"
                                />
                            </div>

                            <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white sm:p-8">
                                <h2 className="text-2xl font-extrabold">
                                    Manage your restaurant
                                </h2>
                                <p className="mt-2 max-w-lg text-sm leading-6 text-orange-50">
                                    Add food categories, manage your menu and process customer
                                    orders from one place.
                                </p>

                                <div className="mt-6 flex flex-wrap gap-3">
                                    <button
                                        onClick={() => setActiveTab("Products")}
                                        className="rounded-xl bg-white px-4 py-3 text-sm font-bold text-orange-600 hover:bg-orange-50"
                                    >
                                        <span className="flex items-center gap-2">
                                            <Plus size={17} />
                                            Add product
                                        </span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab("Orders")}
                                        className="rounded-xl border border-white/40 px-4 py-3 text-sm font-bold text-white hover:bg-white/10"
                                    >
                                        View incoming orders
                                    </button>
                                </div>
                            </div>

                            <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
                                <div className="mb-5 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold">Recent orders</h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Orders received by your restaurant
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setActiveTab("Orders")}
                                        className="text-sm font-semibold text-orange-600 hover:text-orange-700"
                                    >
                                        View all
                                    </button>
                                </div>

                                <OrderTable
                                    orders={orders.slice(0, 3)}
                                    onStatusChange={updateOrderStatus}
                                />
                            </section>
                        </>
                    )}

                    {/* Categories */}
                    {activeTab === "Categories" && (
                        <div className="grid items-start gap-6 xl:grid-cols-[380px_1fr]">
                            <section className="rounded-2xl border border-slate-100 bg-white p-6">
                                <h3 className="text-lg font-bold">Add category</h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Create a category for your food menu.
                                </p>

                                <form onSubmit={addCategory} className="mt-6 space-y-4">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">
                                            Category name
                                        </label>
                                        <input
                                            name="name"
                                            value={categoryName}
                                            onChange={(e) => setCategoryName(e.target.value)}
                                            placeholder="e.g. Pizza, Burgers"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold">
                                            Category Emoji
                                        </label>
                                        <input
                                            name="name"
                                            value={emoji}
                                            onChange={(e) => setEmoji(e.target.value)}
                                            placeholder="e.g. Pizza, Burgers"
                                            className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-50"
                                        />
                                    </div>

                                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600">
                                        <Plus size={18} />
                                        {
                                            loading === true ? (
                                                <Loader text="Add category..." />
                                            ) : (
                                                " Add category"
                                            )
                                        }

                                    </button>
                                </form>
                            </section>

                            <section className="rounded-2xl border border-slate-100 bg-white p-6">
                                <h3 className="text-lg font-bold">All categories</h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    {categories.length} categories created
                                </p>

                                <div className="mt-5 space-y-3">
                                    {categories.map((category) => (
                                        <div
                                            key={category._id}
                                            className="flex items-center justify-between rounded-xl border border-slate-100 p-4"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
                                                    <Tags size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{category.name}</p>
                                                    <p className="text-xs text-slate-400">
                                                        Food category
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => deleteCategory(category._id)}
                                                title="Delete category"
                                                className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                            >
                                                {
                                                    loading === true ? (
                                                        <Loader text="Adding your category" />
                                                    ) : (
                                                        <Trash2 size={18} />
                                                    )
                                                }

                                            </button>
                                        </div>
                                    ))}

                                    {categories.length === 0 && (
                                        <EmptyState text="No categories added yet." />
                                    )}
                                </div>
                            </section>
                        </div>
                    )}

                    {/* Products */}

                    {activeTab === "Products" && (
                        <>
                            <div className="flex w-full justify-end">
                                <button
                                    type="button"
                                    onClick={() => resetForm()}
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all duration-200 hover:-translate-y-0.5 hover:from-orange-600 hover:to-orange-700 hover:shadow-lg active:scale-95"
                                >
                                    <Plus size={18} />
                                    {showForm ? "Close Form" : "Add Product"}
                                </button>
                            </div>

                            {
                                showForm === true && (
                                    <section className="rounded-2xl border border-slate-100 bg-white p-6">
                                        <h3 className="text-lg font-bold">Add new product</h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            Add a food item to your restaurant menu.
                                        </p>

                                        <form
                                            onSubmit={addProduct}
                                            className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3"
                                        >
                                            {/* Product Name */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Product Name *
                                                </label>
                                                <input
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Farmhouse Pizza"
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Description */}
                                            <div className="md:col-span-2">
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Description *
                                                </label>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    placeholder="Describe your product..."
                                                    required
                                                    rows={3}
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Price */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Price (₹) *
                                                </label>
                                                <input
                                                    type="number"
                                                    name="price"
                                                    value={formData.price}
                                                    onChange={handleChange}
                                                    min="1"
                                                    placeholder="299"
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Discount Price */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Discount Price (₹)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="discountPrice"
                                                    value={formData.discountPrice}
                                                    onChange={handleChange}
                                                    min="0"
                                                    placeholder="249"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Image */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Image URL *
                                                </label>
                                                <input
                                                    type="url"
                                                    name="image"
                                                    value={formData.image}
                                                    onChange={handleChange}
                                                    placeholder="https://example.com/pizza.jpg"
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Category */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Category *
                                                </label>
                                                <select
                                                    name="categoryName"
                                                    value={formData.categoryName}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400"
                                                >
                                                    <option value="">Select category</option>
                                                    {categories.map((category) => (
                                                        <option key={category._id} value={category.name}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Food Type */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Food Type *
                                                </label>
                                                <select
                                                    name="foodType"
                                                    value={formData.foodType}
                                                    onChange={handleChange}
                                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-orange-400"
                                                >
                                                    <option value="veg">Veg</option>
                                                    <option value="non-veg">Non-Veg</option>
                                                    <option value="vegan">Vegan</option>
                                                </select>
                                            </div>

                                            {/* Preparation Time */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Preparation Time (minutes)
                                                </label>
                                                <input
                                                    type="number"
                                                    name="preparationTime"
                                                    value={formData.preparationTime}
                                                    onChange={handleChange}
                                                    min="1"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Serving Size */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Serving Size
                                                </label>
                                                <input
                                                    name="servingSize"
                                                    value={formData.servingSize}
                                                    onChange={handleChange}
                                                    placeholder="Medium"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Stock */}
                                            <div>
                                                <label className="mb-2 block text-sm font-semibold">
                                                    Stock Quantity
                                                </label>
                                                <input
                                                    type="number"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    min="0"
                                                    className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-orange-400"
                                                />
                                            </div>

                                            {/* Available */}
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="isAvailable"
                                                    name="isAvailable"
                                                    checked={formData.isAvailable}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 accent-orange-500"
                                                />
                                                <label htmlFor="isAvailable" className="text-sm font-semibold">
                                                    Product Available
                                                </label>
                                            </div>

                                            {/* Featured */}
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    id="isFeatured"
                                                    name="isFeatured"
                                                    checked={formData.isFeatured}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 accent-orange-500"
                                                />
                                                <label htmlFor="isFeatured" className="text-sm font-semibold">
                                                    Featured Product
                                                </label>
                                            </div>

                                            {/* Submit */}
                                            <div className="flex items-end">
                                                <button
                                                    type="submit"
                                                    disabled={categories.length === 0}
                                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
                                                >
                                                    {loading ? (
                                                        <Loader text="Update Product" />
                                                    ) : (
                                                        <>
                                                            <Plus size={18} />
                                                            {editIndex === null ? "Add Product" : "Update Product"}
                                                        </>
                                                    )}

                                                </button>
                                            </div>
                                        </form>
                                    </section>
                                )
                            }


                            <section className="w-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                                {/* Header + Search */}
                                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800">
                                            Your Menu
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-400">
                                            {filteredProducts.length} products found
                                        </p>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="relative w-full md:max-w-sm lg:max-w-md">
                                        <Search
                                            size={19}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            type="text"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Search by product or category..."
                                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-100"
                                        />

                                        {search && (
                                            <button
                                                type="button"
                                                onClick={() => setSearch("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                                title="Clear search"
                                            >
                                                <X size={17} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Product Table */}
                                <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
                                    <table className="w-full min-w-[850px] table-auto text-left">
                                        <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                                            <tr>
                                                <th className="w-[35%] px-6 py-4">Product</th>
                                                <th className="w-[25%] px-6 py-4">Category</th>
                                                <th className="w-[20%] px-6 py-4">Price</th>
                                                <th className="w-[20%] px-6 py-4 text-right">Action</th>
                                            </tr>
                                        </thead>

                                        <tbody className="divide-y divide-slate-100">
                                            {filteredProducts.map((product, index) => (
                                                <tr
                                                    key={product._id}
                                                    className="transition hover:bg-orange-50/30"
                                                >
                                                    {/* Product */}
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={product.image || "/placeholder-food.png"}
                                                                alt={product.name}
                                                                className="h-14 w-14 shrink-0 rounded-xl border border-slate-100 object-cover"
                                                            />

                                                            <div>
                                                                <p className="font-semibold text-slate-800">
                                                                    {product.name}
                                                                </p>
                                                                <p className="mt-1 text-xs capitalize text-slate-400">
                                                                    {product.foodType || "Food"}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    {/* Category */}
                                                    <td className="px-6 py-5">
                                                        <span className="inline-block rounded-lg bg-orange-50 px-3 py-2 text-xs font-semibold capitalize text-orange-600">
                                                            {product.categoryName ||
                                                                product.category?.name ||
                                                                product.categoryId?.name ||
                                                                "Uncategorized"}
                                                        </span>
                                                    </td>

                                                    {/* Price */}
                                                    <td className="px-6 py-5">
                                                        <div className="font-bold text-slate-800">
                                                            ₹{product.discountPrice ?? product.price}
                                                        </div>

                                                        {product.discountPrice != null &&
                                                            product.discountPrice < product.price && (
                                                                <p className="mt-1 text-sm text-slate-400 line-through">
                                                                    ₹{product.price}
                                                                </p>
                                                            )}
                                                    </td>

                                                    {/* Actions */}
                                                    <td className="px-6 py-5 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                UpdateHandle(product, index)

                                                            }}
                                                            title="Delete product"
                                                            className="inline-flex items-center justify-center rounded-xl bg-red-50 p-3 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                                                        >
                                                            <Pencil size={18} />
                                                        </button>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => deleteProduct(product._id)}
                                                            title="Delete product"
                                                            className="inline-flex items-center justify-center rounded-xl bg-red-50 p-3 text-red-500 transition hover:bg-red-100 hover:text-red-700"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* Empty State */}
                                            {filteredProducts.length === 0 && (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <Search size={32} className="mb-3 text-slate-300" />
                                                            <p className="font-semibold text-slate-600">
                                                                No products found
                                                            </p>
                                                            <p className="mt-1 text-sm text-slate-400">
                                                                Try another product name or category.
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        </>
                    )}

                    {/* Incoming orders */}
                    {activeTab === "Orders" && (
                        <section className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-6">
                            <div className="mb-6">
                                <h3 className="text-lg font-bold">Incoming orders</h3>
                                <p className="mt-1 text-sm text-slate-400">
                                    Accept and update your customers' orders.
                                </p>
                            </div>

                            <OrderTable
                                orders={orders}
                                onStatusChange={updateOrderStatus}
                            />

                            {orders.length === 0 && (
                                <EmptyState text="No orders received yet." />
                            )}
                        </section>
                    )}
                </main>
            </div>

            {message && (
                <div className="fixed bottom-5 right-5 z-[70] flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-4 text-sm font-semibold text-white shadow-xl">
                    <CheckCircle size={18} className="text-emerald-400" />
                    {message}
                </div>
            )}
        </div>
    );
}

function Stat({ title, value, icon: Icon, color }) {
    const colors = {
        orange: "bg-orange-50 text-orange-500",
        blue: "bg-blue-50 text-blue-500",
        purple: "bg-purple-50 text-purple-500",
        green: "bg-emerald-50 text-emerald-500",
    };

    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <div className={`rounded-xl p-3 ${colors[color]}`}>
                    <Icon size={21} />
                </div>
            </div>
            <h3 className="mt-4 text-3xl font-extrabold text-slate-900">
                {value}
            </h3>
        </div>
    );
}


function OrderTable({ orders, onStatusChange }) {
    const getStatusStyle = (status) => {
        const styles = {
            pending: "bg-amber-50 text-amber-700",
            confirmed: "bg-blue-50 text-blue-700",
            preparing: "bg-orange-50 text-orange-700",
            ready: "bg-purple-50 text-purple-700",
            picked_up: "bg-indigo-50 text-indigo-700",
            out_for_delivery: "bg-cyan-50 text-cyan-700",
            delivered: "bg-emerald-50 text-emerald-700",
            cancelled: "bg-red-50 text-red-700",
            rejected: "bg-red-50 text-red-700",
        };

        return styles[status?.toLowerCase()] || "bg-slate-100 text-slate-600";
    };

    const formatAddress = (address = {}) => {
        return [
            address.house,
            address.address,
            address.street,
            address.landmark,
            address.city,
            address.state,
            address.pincode,
            address.zipCode,
        ]
            .filter((part) => typeof part === "string" && part.trim())
            .join(", ");
    };

    return (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[1200px] text-left">
                <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                    <tr>
                        <th className="px-4 py-4">Order Details</th>
                        <th className="px-4 py-4">Customer Details</th>
                        <th className="px-4 py-4">Delivery Address</th>
                        <th className="px-4 py-4">Food Items</th>
                        <th className="px-4 py-4">Amount</th>
                        <th className="px-4 py-4">Payment</th>
                        <th className="px-4 py-4">Status</th>
                        <th className="px-4 py-4">Update</th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                    {orders?.length > 0 ? (
                        orders.map((order) => {
                            const address = order.deliveryAddress || {};

                            const customerName =
                                order?.customer ||
                                order.customerName ||
                                address.fullName ||
                                address.name ||
                                "Name unavailable";

                            const phone =
                                order.customer?.phone ||
                                order.customer?.mobile ||
                                order.phone ||
                                address.phone ||
                                address.mobile ||
                                "Phone unavailable";

                            const email =
                                order.customer?.email ||
                                order.email ||
                                "Email unavailable";

                            const fullAddress = formatAddress(address);

                            const status = (
                                order.orderStatus || "pending"
                            ).toLowerCase();

                            const total =
                                Number(order.subtotal || 0) +
                                Number(order.deliveryCharge || 0) +
                                Number(order.tax || 0) -
                                Number(order.discount || 0);

                            return (
                                <tr
                                    key={order._id}
                                    className="align-top transition hover:bg-slate-50"
                                >
                                    {/* Order Details */}
                                    <td className="px-4 py-4">
                                        <p className="font-bold text-orange-600">
                                            #{order.orderId}
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            {order.createdAt
                                                ? new Date(
                                                    order.createdAt
                                                ).toLocaleString()
                                                : "Date unavailable"}
                                        </p>

                                        {order.specialInstructions && (
                                            <p className="mt-2 max-w-40 text-xs text-slate-500">
                                                Note: {order.specialInstructions}
                                            </p>
                                        )}
                                    </td>

                                    {/* Customer Details */}
                                    <td className="px-4 py-4">
                                        <p className="font-semibold text-slate-800">
                                            {customerName}
                                        </p>

                                        <p className="mt-2 text-sm text-slate-600">
                                            📞 {phone}
                                        </p>

                                        <p className="mt-2 max-w-48 break-all text-xs text-slate-400">
                                            {email}
                                        </p>
                                    </td>

                                    {/* Full Delivery Address */}
                                    <td className="px-4 py-4">
                                        <div className="max-w-56">
                                            {fullAddress ? (
                                                <p className="whitespace-normal text-sm leading-6 text-slate-600">
                                                    📍 {fullAddress}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-slate-400">
                                                    Address unavailable
                                                </p>
                                            )}
                                        </div>
                                    </td>

                                    {/* Food Items */}
                                    <td className="px-4 py-4">
                                        <div className="min-w-44 space-y-3">
                                            {order.items?.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="flex items-center gap-3"
                                                >
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="h-12 w-12 rounded-lg object-cover"
                                                    />

                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-800">
                                                            {item.name}
                                                        </p>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            ₹{item.price} ×{" "}
                                                            {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                    {/* Amount */}
                                    <td className="px-4 py-4">
                                        <p className="font-bold text-slate-800">
                                            ₹{total}
                                        </p>

                                        <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                                            Subtotal: ₹{order.subtotal || 0}
                                        </p>

                                        <p className="text-xs text-slate-400">
                                            Delivery: ₹
                                            {order.deliveryCharge || 0}
                                        </p>

                                        {Number(order.discount) > 0 && (
                                            <p className="text-xs text-emerald-600">
                                                Discount: -₹{order.discount}
                                            </p>
                                        )}
                                    </td>

                                    {/* Payment */}
                                    <td className="px-4 py-4">
                                        <p className="text-sm font-medium uppercase text-slate-700">
                                            {order.paymentMethod || "N/A"}
                                        </p>

                                        <span
                                            className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${order.paymentStatus?.toLowerCase() ===
                                                "paid"
                                                ? "bg-emerald-50 text-emerald-700"
                                                : "bg-amber-50 text-amber-700"
                                                }`}
                                        >
                                            {order.paymentStatus || "pending"}
                                        </span>
                                    </td>

                                    {/* Current Status */}
                                    <td className="px-4 py-4">
                                        <span
                                            className={`inline-block whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                                                status
                                            )}`}
                                        >
                                            {status.replaceAll("_", " ")}
                                        </span>
                                    </td>

                                    {/* Update Status */}
                                    <td className="px-4 py-4">
                                        <select
                                            value={status}
                                            onChange={(e) =>
                                                onStatusChange(
                                                    order._id,
                                                    e.target.value
                                                )
                                            }
                                            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium capitalize outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                                        >
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="confirmed">
                                                Confirmed
                                            </option>
                                            <option value="preparing">
                                                Preparing
                                            </option>
                                            <option value="ready">
                                                Ready
                                            </option>
                                            <option value="picked_up">
                                                Picked Up
                                            </option>
                                            <option value="out_for_delivery">
                                                Out for Delivery
                                            </option>
                                            <option value="delivered">
                                                Delivered
                                            </option>
                                            <option value="cancelled">
                                                Cancelled
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                        </select>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-4 py-12 text-center">
                                <p className="font-semibold text-slate-600">
                                    No orders found
                                </p>

                                <p className="mt-1 text-sm text-slate-400">
                                    New restaurant orders will appear here.
                                </p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}



function EmptyState({ text }) {
    return (
        <div className="py-12 text-center text-sm text-slate-400">
            <Package size={30} className="mx-auto mb-3 text-slate-300" />
            {text}
        </div>
    );
}

function AccessMessage({ title, description, buttonText, onClick }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
            <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
                <ShieldAlert size={44} className="mx-auto text-orange-500" />
                <h1 className="mt-5 text-2xl font-extrabold text-slate-900">
                    {title}
                </h1>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                    {description}
                </p>
                <button
                    onClick={onClick}
                    className="mt-6 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
                >
                    {buttonText}
                </button>
            </div>
        </div>
    );
}