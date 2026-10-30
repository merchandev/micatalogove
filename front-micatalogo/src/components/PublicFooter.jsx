import { Link } from 'react-router-dom';

export default function PublicFooter() {
  return <footer className="site-footer"><div className="footer-main"><div><Link to="/" className="wordmark"><span className="brand-mark">m.</span>MiCatálogo.</Link><p>Tu negocio tiene mucho que mostrar.<br />Dale un lugar propio.</p></div><div className="footer-links"><Link to="/demos">Diseños de tienda</Link><Link to="/planes">Plan y precio</Link><Link to="/contacto">Contacto</Link><Link to="/admin/login">Entrar al panel</Link></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} MiCatálogo · Venezuela</span><div><Link to="/terminos">Términos</Link><Link to="/aviso-legal">Aviso legal</Link><Link to="/cookies">Cookies</Link></div><span>Hecho para negocios reales.</span></div></footer>;
}
