import "@/styles/globals.css";
import DarkModeToggle from "@/components/DarkModeToggle";
import BackButton from "@/components/BackButton";

export default function App({ Component, pageProps }) {
  return (
    <>
      <BackButton />
      <DarkModeToggle /> 
      <Component {...pageProps} />
    </>
  );
}
