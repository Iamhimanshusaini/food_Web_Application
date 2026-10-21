import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Tag, Heading1 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"
export default function Cart() {
  const { user } = useAuth()
  const { cart, addToCart, decrease, removeFromCart, subtotal, deliveryFee, total } = useCart();
  const navigate = useNavigate();

  if (!cart.length) return <div className="empty-page"><div className="empty-icon">🛒</div><h1>Your cart is empty</h1><p>Add delicious food from your favorite restaurants.</p><Link className="primary-btn" to="/restaurants">Browse food</Link></div>;

  return <div className="container page">
    <div className="page-heading"><span className="eyebrow">YOUR ORDER</span><h1>Shopping cart</h1><p>{cart.reduce((s, i) => s + i.quantity, 0)} items in your cart</p></div>
    <div className="checkout-grid">
      <div className="cart-list">
        {cart.map(item => <div className="cart-item" key={item.id}>
          <img src={item.image} alt={item.name} />
          <div className="cart-item-info"><h3>{item.name}</h3><p>{item.category}</p><strong>₹{item.price}</strong></div>
          <div className="quantity"><button onClick={() => decrease(item.id)}><Minus size={15} /></button><b>{item.quantity}</b><button onClick={() => addToCart(item)}><Plus size={15} /></button></div>
          <div className="item-total">₹{item.price * item.quantity}</div>
          <button className="delete-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={18} /></button>
        </div>)}
        <div className="coupon"><Tag size={18} /><input placeholder="Enter coupon code" /><button>Apply</button></div>
      </div>
      <aside className="summary">
        <h2>Bill details</h2>
        <div><span>Item total</span><b>₹{subtotal}</b></div><div><span>Delivery fee</span><b>{deliveryFee ? `₹${deliveryFee}` : "FREE"}</b></div><div className="total-line"><span>To pay</span><strong>₹{total}</strong></div>

        {
          user ? (
            <button className="primary-btn full" onClick={() => navigate("/checkout")}>
               Proceed to checkout <ArrowRight size={18} />
            </button>
          ) : (
            <button className="primary-btn full" onClick={() => navigate("/login")}>
               Login
            </button>
          )

        }

        <small>Free delivery on orders above ₹499</small>
      </aside>
    </div>
  </div>;
}