import { Link } from "react-router-dom";
import { ArrowRight, Clock, PackageCheck } from "lucide-react";
import { sampleOrders } from "../data/demoData";

export default function Orders() {
  return <div className="container page">
    <div className="page-heading"><span className="eyebrow">ACCOUNT</span><h1>My orders</h1><p>Track your recent orders and view order details.</p></div>
    <div className="orders-list">{sampleOrders.map(order=><div className="order-card" key={order.id}><div className="order-head"><div><span className="order-id">{order.id}</span><h3>{order.restaurant}</h3></div><span className={`status ${order.status==="Delivered"?"delivered":"active-status"}`}>{order.status}</span></div><div className="order-body"><div><Clock/> {order.date}</div><div><PackageCheck/> {order.items.map(i=>`${i.name} × ${i.quantity}`).join(", ")}</div><strong>₹{order.total}</strong></div><Link to={`/orders/${order.id}`} className="order-link">View details <ArrowRight size={16}/></Link></div>)}</div>
  </div>;
}