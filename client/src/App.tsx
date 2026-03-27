import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Navigation from "./components/Navigation";
import ResearchBanner from "./components/ResearchBanner";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import LegalPopup from "./components/LegalPopup";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import COA from "./pages/COA";
import Research from "./pages/Research";
import Contact from "./pages/Contact";
import Partner from "./pages/Partner";
import Checkout from "./pages/Checkout";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/product/:id" component={ProductDetail} />
      <Route path="/coa" component={COA} />
      <Route path="/research" component={Research} />
      <Route path="/contact" component={Contact} />
      <Route path="/partner" component={Partner} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/terms" component={Legal} />
      <Route path="/privacy" component={Legal} />
      <Route path="/disclaimer" component={Legal} />
      <Route path="/shipping" component={Legal} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <LegalPopup />
            <CartDrawer />
            <div className="flex flex-col min-h-screen">
              <ResearchBanner />
              <Navigation />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
