import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Paths (lowercase) that a product-manager is allowed to visit.
// Edit-product and bulk-upload are matched by prefix below.
const PM_ALLOWED_PATHS = [
  '/admin',
  '/admin/products',
  '/admin/add-product',
  '/admin/attributes',
  '/admin/products/bulk-upload',
];

const isAllowedForProductManager = (pathname) => {
  const lower = pathname.toLowerCase();
  if (PM_ALLOWED_PATHS.includes(lower)) return true;
  // dynamic segments
  if (lower.startsWith('/admin/edit-product/')) return true;
  if (lower.startsWith('/admin/products/bulk-upload')) return true;
  return false;
};

const ProtectedRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="./login" replace />;
  }

  // Regular users cannot enter the admin area at all
  if (user?.role === 'user' && location.pathname.toLowerCase().includes('/admin')) {
    return <Navigate to="/" replace />;
  }

  // Product managers are locked out of everything except product/attribute pages
  if (user?.role === 'product-manager' && location.pathname.toLowerCase().includes('/admin')) {
    if (!isAllowedForProductManager(location.pathname)) {
      return <Navigate to="/Admin/products" replace />;
    }
  }

  return <Outlet />;
};

export { ProtectedRoute };
