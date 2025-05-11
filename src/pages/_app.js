import "@/styles/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import BackButton from "@/components/BackButton";
import CartIcon from "@/components/CartIcon";

export default function App({ Component, pageProps }) {
  return (
    <>
      <BackButton />
      <CartIcon />
      <DarkModeToggle />

      <Component {...pageProps} />
    </>
  );
}
