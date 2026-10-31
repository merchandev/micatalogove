import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const designs = [
  ['boutique-demo', 'Boutique', 'Para prendas que merecen una buena vitrina.', 'photo-1441984904996-e0b6ba687e04'],
  ['postres-demo', 'Postres', 'Una carta dulce, lista para compartir.', 'photo-1551024506-0bccd828d307'],
  ['tech-demo', 'Tecnología', 'Productos, especificaciones y disponibilidad.', 'photo-1505740420928-5e560c06d30e'],
  ['restaurant-demo', 'Restaurante', 'Tu menú, a un mensaje de distancia.', 'photo-1555396273-367ea4eb4db5'],
  ['minimal-demo', 'Esencial', 'Deja el protagonismo a tus productos.', 'photo-1490481651871-ab68de25d43d'],
];

export default function Demos() {
  return <div className="marketing-site"><PublicNavbar /><main className="page-width inner-page"><p className="eyebrow">CINCO FORMAS DE MOSTRAR LO TUYO</p><div className="page-heading"><h1>Elige tu<br /><em>primera impresión.</em></h1><p>Abre los ejemplos y recorre cada diseño.<br />Después, hazlo tuyo con tus productos y el nombre de tu tienda.</p></div><div className="design-gallery">{designs.map(([id, title, description, photo], index) => <Link to={`/tienda/${id}`} className="gallery-item" key={id}><div className="gallery-image"><img src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=900&q=80`} alt={`Referencia visual del diseño ${title}`} loading={index < 2 ? 'eager' : 'lazy'} /><span>VER DISEÑO <ArrowUpRight size={17} /></span></div><div className="gallery-title"><span>0{index + 1}</span><h2>{title}</h2><ArrowUpRight size={22} /></div><p>{description}</p></Link>)}</div><div className="inline-callout"><p>El diseño es el comienzo.<br /><strong>El negocio lo pones tú.</strong></p><Link to="/register" className="button">Probar 7 días <ArrowUpRight size={17} /></Link></div></main><PublicFooter /></div>;
}
