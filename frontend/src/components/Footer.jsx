import { Link } from "react-router-dom";
import { Instagram, Facebook, Twitter, Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Link className="brand footer-brand" to="/"><span className="brand-icon">🍔</span> Foodly</Link>
          <p>Delicious food from your favorite restaurants, delivered fresh to your doorstep.</p>
          <div className="socials"><Instagram/><Facebook/><Twitter/></div>
        </div>
        <div><h4>Company</h4><Link to="/">About us</Link><Link to="/restaurants">Restaurants</Link><Link to="/orders">Orders</Link></div>
        <div><h4>Help</h4><a href="#">FAQ</a><a href="#">Privacy Policy</a><a href="#">Terms & Conditions</a></div>
        <div><h4>Contact</h4><p><Mail size={15}/> support@foodly.com</p><p><Phone size={15}/> +91 98765 43210</p></div>
      </div>
      <div className="footer-bottom">© 2026 Foodly. All rights reserved.</div>
    </footer>
  );
}