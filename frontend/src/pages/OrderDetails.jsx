import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Clock3, Package, Bike, Home } from "lucide-react";
import { sampleOrders } from "../data/demoData";

const steps = [
  ["Order confirmed", "Your order has been confirmed", Check],
  ["Preparing food", "Restaurant is preparing your food", Package],
  ["Out for delivery", "Delivery partner is on the way", Bike],
  ["Delivered", "Enjoy your delicious meal!", Home]
];

export default function OrderDetails() {
  const { id } = useParams();
  const saved = JSON.parse(localStorage.getItem("foodly_last_order") || "null");
  const order = sampleOrders.find(o=>o.id===id) || (saved?.orderId===id ? {...saved, restaurant:"Spice Garden"} : null);

  if (!order) return <div className="empty-page"><div className="empty-icon">📦</div><h1>Order not found</h1><Link className="primary-btn" to="/orders">My orders</Link></div>;

  return <div className="container page narrow-page">
    <Link className="back-link" to="/orders"><ArrowLeft size={17}/> Back to orders</Link>
    <div className="order-detail-head"><div><span className="eyebrow">ORDER TRACKING</span><h1>{order.id}</h1><p>{order.restaurant}</p></div><span className="status active-status">{order.status}</span></div>
    <div className="tracking-card"><h2>Track your order</h2><div className="timeline">{steps.map(([title,text,Icon],i)=><div className="timeline-step" key={title}><div className="timeline-icon"><Icon size={19}/></div><div><b>{title}</b><p>{text}</p></div>{i===0&&<span className="live-dot"></span>}</div>)}</div></div>
    <div className="detail-two-col"><div className="form-card"><h2>Items</h2>{(order.items||[]).map((item,i)=><div className="summary-item" key={i}><span>{item.name} × {item.quantity}</span><b>₹{item.price*item.quantity}</b></div>)}</div><div className="form-card"><h2>Payment</h2><div className="summary-item"><span>Payment method</span><b>{order.payment||"Online"}</b></div><div className="summary-item"><span>Total</span><strong>₹{order.total}</strong></div></div></div>
  </div>;
}