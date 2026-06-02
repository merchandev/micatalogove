import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';

import LandingPage from './pages/LandingPage';
import Planes from './pages/Planes';
import Contacto from './pages/Contacto';
import Demos from './pages/Demos';
import Funcionalidades from './pages/Funcionalidades';

// Demos
import BoutiqueDemo from './pages/demos/BoutiqueDemo';
import PostresDemo from './pages/demos/PostresDemo';
import TechDemo from './pages/demos/TechDemo';
import RestaurantDemo from './pages/demos/RestaurantDemo';
import MinimalDemo from './pages/demos/MinimalDemo';
import TerminosYCondiciones from './pages/legal/TerminosYCondiciones';
import AvisoLegal from './pages/legal/AvisoLegal';
import PoliticaCookies from './pages/legal/PoliticaCookies';
import CookieBanner from './components/CookieBanner';

// Blog
import BlogIndex from './pages/BlogIndex';
import BlogPost from './pages/BlogPost';
import BlogAdmin from './pages/admin/BlogAdmin';
import BlogForm from './pages/admin/BlogForm';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/planes" element={<Planes />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/funcionalidades" element={<Funcionalidades />} />
            <Route path="/terminos" element={<TerminosYCondiciones />} />
            <Route path="/aviso-legal" element={<AvisoLegal />} />
            <Route path="/cookies" element={<PoliticaCookies />} />
            
            {/* Rutas de Demos Hardcodeadas */}
            <Route path="/tienda/boutique-demo" element={<BoutiqueDemo />} />
            <Route path="/tienda/postres-demo" element={<PostresDemo />} />
            <Route path="/tienda/tech-demo" element={<TechDemo />} />
            <Route path="/tienda/restaurant-demo" element={<RestaurantDemo />} />
            <Route path="/tienda/minimal-demo" element={<MinimalDemo />} />
            
            <Route path="/tienda/:domain" element={<StoreFront />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="blog" element={<BlogAdmin />} />
              <Route path="blog/create" element={<BlogForm />} />
              <Route path="blog/edit/:id" element={<BlogForm />} />
            </Route>

            <Route path="*" element={<div className="p-10 text-center text-white">404 - Not Found</div>} />
          </Routes>
          <CookieBanner />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
