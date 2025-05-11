import "@/styles/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import BackButton from "@/components/BackButton";
import CartIcon from "@/components/CartIcon";
import { CartProvider } from "@/contexts/CartContext"; // <-- IMPORT

export default function App({ Component, pageProps }) {
  return (
    <CartProvider> {/* <-- WRAP EVERYTHING */}
      <BackButton />
      <CartIcon />
      <DarkModeToggle />

      <Component {...pageProps} />
    </CartProvider>
  );
}
