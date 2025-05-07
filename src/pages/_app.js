import "@/styles/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function App({ Component, pageProps }) {
  return (
    <>
      <DarkModeToggle /> {/* මෙතන දැමුවාම හරියට සියලුම පිටු වල පෙන්නයි */}
      <Component {...pageProps} />
    </>
  );
}
