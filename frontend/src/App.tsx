import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import Layout from "@/components/layout/Layout";
import ScrollToTop from "@/components/layout/ScrollToTop";
import HomePage from "@/pages/HomePage";
import ShopPage from "@/pages/ShopPage";
import ProductPage from "@/pages/ProductPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderConfirmedPage from "@/pages/OrderConfirmedPage";
import DealsPage from "@/pages/DealsPage";
import PlaceholderPage from "@/pages/PlaceholderPage";
import NotFoundPage from "@/pages/NotFoundPage";

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmed" element={<OrderConfirmedPage />} />
          <Route path="/deals" element={<DealsPage />} />

          {/* Content pages, stubbed so no navigation link 404s today. */}
          <Route path="/about" element={<PlaceholderPage title="About IKO" />} />
          <Route path="/contact" element={<PlaceholderPage title="Contact" />} />
          <Route path="/account" element={<PlaceholderPage title="Your Account" />} />
          <Route path="/shipping" element={<PlaceholderPage title="Shipping Info" />} />
          <Route path="/returns" element={<PlaceholderPage title="Returns" />} />
          <Route path="/privacy" element={<PlaceholderPage title="Privacy Policy" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CartProvider>
  );
}
