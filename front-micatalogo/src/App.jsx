import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StoreFront from './pages/StoreFront';
import ProductDetail from './pages/ProductDetail';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import Login from './pages/admin/Login';
import Register from './pages/admin/Register';
import ForgotPassword from './pages/admin/ForgotPassword';
import ResetPassword from './pages/admin/ResetPassword';
import VerifyEmail from './pages/admin/VerifyEmail';
import Dashboard from './pages/admin/Dashboard';
import ProductsAdmin from './pages/admin/ProductsAdmin';
import StoreSettings from './pages/admin/StoreSettings';
import Subscription from './pages/admin/Subscription';
import PlatformOverview from './pages/admin/PlatformOverview';
import AccountSecurity from './pages/admin/AccountSecurity';
import ConversationsAdmin from './pages/admin/ConversationsAdmin';
import CartsAdmin from './pages/admin/CartsAdmin';
import SalesAdmin from './pages/admin/SalesAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import DatabaseAdmin from './pages/admin/DatabaseAdmin';

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
// The rich text editor (Quill) is only downloaded by staff opening the blog form.
const BlogForm = lazy(() => import('./pages/admin/BlogForm'));
const blogForm = <Suspense fallback={<div className="text-gray-400">Cargando editor...</div>}><BlogForm /></Suspense>;
import { ROLES } from './lib/permissions';

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
            
            <Route path="/tienda/:domain/productos/:productId" element={<ProductDetail />} />
            <Route path="/tienda/:domain/producto/:productId" element={<ProductDetail />} />
            <Route path="/tienda/:domain/productos" element={<StoreFront />} />
            <Route path="/tienda/:domain" element={<StoreFront />} />
            <Route path="/blog" element={<BlogIndex />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="store" element={<StoreSettings />} />
              <Route path="stores" element={<ProtectedRoute roles={[ROLES.SUPERADMIN]}><PlatformOverview /></ProtectedRoute>} />
              <Route path="security" element={<AccountSecurity />} />
              <Route path="subscription" element={<ProtectedRoute roles={[ROLES.CLIENT, ROLES.SUPERADMIN]}><Subscription /></ProtectedRoute>} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="conversations" element={<ConversationsAdmin />} />
              <Route path="carts" element={<CartsAdmin />} />
              <Route path="sales" element={<SalesAdmin />} />
              <Route path="users" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}><UsersAdmin /></ProtectedRoute>} />
              <Route path="blog" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}><BlogAdmin /></ProtectedRoute>} />
              <Route path="blog/create" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>{blogForm}</ProtectedRoute>} />
              <Route path="blog/edit/:id" element={<ProtectedRoute roles={[ROLES.ADMIN, ROLES.SUPERADMIN]}>{blogForm}</ProtectedRoute>} />
              <Route path="database" element={<ProtectedRoute roles={[ROLES.SUPERADMIN]}><DatabaseAdmin /></ProtectedRoute>} />
            </Route>

            {/* Paginas de catalogos generadas automaticamente: dominio/tienda y dominio/tienda/productos/... */}
            <Route path="/:domain/productos/:productId" element={<ProductDetail />} />
            <Route path="/:domain/producto/:productId" element={<ProductDetail />} />
            <Route path="/:domain/productos" element={<StoreFront />} />
            <Route path="/:domain" element={<StoreFront />} />

            <Route path="*" element={<div className="p-10 text-center text-white">404 - Not Found</div>} />
          </Routes>
          <CookieBanner />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
