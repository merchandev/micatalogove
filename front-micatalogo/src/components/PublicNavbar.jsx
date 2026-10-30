import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const links = [['/funcionalidades', 'Cómo funciona'], ['/demos', 'Diseños'], ['/planes', 'Precio'], ['/blog', 'Notas']];

export default function PublicNavbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link to="/" className="wordmark" onClick={close} aria-label="MiCatálogo, inicio"><span className="brand-mark" aria-hidden="true">m.</span><span>MiCatálogo<span className="brand-dot">.</span></span></Link>
        <nav className="desktop-links" aria-label="Navegación principal">{links.map(([to, label]) => <Link key={to} to={to} aria-current={pathname === to ? 'page' : undefined}>{label}</Link>)}</nav>
        <div className="nav-actions"><Link to="/admin/login" className="sign-in">Ingresar</Link><Link to="/register" className="button button-small">Crear mi tienda <ArrowUpRight size={16} /></Link><button type="button" className="mobile-toggle" aria-label={open ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X size={23} /> : <Menu size={23} />}</button></div>
      </div>
      {open && <nav id="mobile-navigation" className="mobile-links" aria-label="Navegación móvil">{links.map(([to, label]) => <Link key={to} to={to} onClick={close}>{label}<ArrowUpRight size={16} /></Link>)}<Link to="/contacto" onClick={close}>Contacto<ArrowUpRight size={16} /></Link><Link to="/admin/login" onClick={close}>Ingresar a mi cuenta<ArrowUpRight size={16} /></Link></nav>}
    </header>
  );
}
