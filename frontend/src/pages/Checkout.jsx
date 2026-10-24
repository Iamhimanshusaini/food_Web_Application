import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, CreditCard, MapPin, Smartphone } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from 'axios'
import API from '../api/api'
export default function Checkout() {
  const token = localStorage.getItem('token')
  const { cart, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [payment, setPayment] = useState("online");
  const [address, setAddress] = useState({ fullName: user?.name || "", phone: "", address: "", city: "", state: '', pincode: "" });
  const [placed, setPlaced] = useState(false);

  const orderId = `ORD${Math.floor(10000 + Math.random() * 90000)}`;

  console.log(cart, subtotal, total)
  const orderData = {
    customer: user.name,
    customerId: user._id,
    email: user.email,
    orderId: orderId,
    items: cart,
    subtotal,
    deliveryCharge: deliveryFee,
    total,
    deliveryAddress: address,
    paymentMethod: payment,
    orderStatus: "Confirmed"
  }
  console.log(orderData)
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!cart.length) return navigate("/cart");
    try {
      const res = await axios.post(`${API}/create-order`,
        orderData
        ,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      alert(res.data.message)
      clearCart();
      setPlaced(true);
      setTimeout(() => navigate(`/orders/${orderId}`), 1200);
    } catch (error) {
      console.log(error.message)
      alert(error.response?.data?.message)
    }

  };

  if (placed) return <div className="success-page"><CheckCircle2 size={72} /><h1>Order placed!</h1><p>Your food is being prepared. Redirecting to order tracking...</p></div>;

  return <div className="container page">
    <div className="page-heading"><span className="eyebrow">CHECKOUT</span><h1>Complete your order</h1></div>
    <form onSubmit={onSubmit} className="checkout-grid">
      <div>
        <section className="form-card">
          <h2><MapPin /> Delivery address</h2>
          <div className="form-grid">
            <input required placeholder="Full name" value={address.fullName} onChange={e => setAddress({ ...address, fullName: e.target.value })} />
            <input required placeholder="Phone number" value={address.phone} onChange={e => setAddress({ ...address, phone: e.target.value })} /><input required className="full-input" placeholder="House no., street, area" value={address.address} onChange={e => setAddress({ ...address, address: e.target.value })} />
            <input required placeholder="City" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} />
            <input required placeholder="Pincode" value={address.pincode} onChange={e => setAddress({ ...address, pincode: e.target.value })} /></div>
        </section>
        <section className="form-card">
          <h2><CreditCard /> Payment method</h2>
          <label className={`payment-option ${payment === "online" ? "selected" : ""}`}>
            <input type="radio" checked={payment === "online"} onChange={() => setPayment("online")} />
            <Smartphone /><div><b>Online payment</b><small>UPI, cards & net banking</small></div></label><label className={`payment-option ${payment === "cod" ? "selected" : ""}`}>
            <input type="radio" checked={payment === "cod"} onChange={() => setPayment("cod")} />
            <span className="cash-icon">₹</span>
            <div><b>Cash on Delivery</b><small>Pay when your order arrives</small></div></label></section>
      </div>
      <aside className="summary"><h2>Order summary</h2>
        {
          cart.map(i => <div className="summary-item" key={i.id}><span>{i.name} × {i.quantity}</span><b>₹{i.price * i.quantity}</b></div>)
        }
        <hr /><div><span>Subtotal</span><b>₹{subtotal}</b></div><div><span>Delivery</span><b>{deliveryFee ? "₹" + deliveryFee : "FREE"}</b></div><div className="total-line"><span>Total</span><strong>₹{total}</strong></div><button className="primary-btn full" type="submit">Place order • ₹{total}</button></aside>
    </form>
  </div>;
}