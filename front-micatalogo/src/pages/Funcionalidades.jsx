import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import PublicNavbar from '../components/PublicNavbar';
import PublicFooter from '../components/PublicFooter';

const features = [
  ['La vitrina', 'Tus productos, bien presentados.', 'Fotos, descripción, precio y disponibilidad. Cada producto tiene su ficha y un enlace para compartirlo directamente.'],
  ['El inventario', 'Lo que tienes, a la vista.', 'Organiza productos por categoría, identifica cada uno por su SKU y consulta las alertas de existencias bajas.'],
  ['El pedido', 'De una selección a una conversación.', 'El cliente reúne sus productos en el carrito. Tú recibes el pedido y coordinas el pago y la entrega por WhatsApp.'],
  ['El seguimiento', 'Cada consulta tiene su lugar.', 'Consulta las conversaciones y los carritos registrados para dar seguimiento a las personas interesadas en tu tienda.'],
  ['Las ventas', 'Una mirada a tu negocio.', 'Revisa los pedidos completados, los productos con más movimiento y la actividad reciente desde el panel.'],
  ['Tu identidad', 'Un enlace con tu nombre.', 'Elige entre cinco diseños, configura tu tienda y comparte el enlace o el código QR de tu catálogo.'],
];

export default function Funcionalidades() {
  return <div className="marketing-site"><PublicNavbar /><main className="page-width inner-page"><p className="eyebrow">LO NECESARIO PARA EL DÍA A DÍA</p><div className="page-heading"><h1>Menos tareas sueltas.<br /><em>Más orden.</em></h1><p>Tu catálogo, inventario y pedidos conectados.<br />Un espacio para llevar el ritmo de tu negocio.</p></div><div className="feature-ledger">{features.map(([label, title, description], index) => <article key={label}><div><span>0{index + 1}</span><p>{label}</p></div><h2>{title}</h2><p>{description}</p></article>)}</div><div className="inline-callout"><p>Conoce el plan completo.<br /><strong>7 días gratis. Luego, USD 5 al mes.</strong></p><Link className="button" to="/planes">Ver el plan <ArrowRight size={17} /></Link></div><Link to="/demos" className="text-link">Antes de empezar, mira los diseños <ArrowUpRight size={17} /></Link></main><PublicFooter /></div>;
}
