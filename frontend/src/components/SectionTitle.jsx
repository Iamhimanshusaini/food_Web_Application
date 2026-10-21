import { Link } from "react-router-dom";

export default function SectionTitle({ title, subtitle, link, linkText = "View all" }) 
{
     

 
 return <div className="section-title">
    <div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div>
    {link && <Link to={link}>{linkText} →</Link>}
  </div>;
}

