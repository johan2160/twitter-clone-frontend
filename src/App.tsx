import { ThemeProvider } from "@/components/theme-provider"
import MainPage from "./pages/MainPage";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <MainPage />
    </ThemeProvider>
  );
}
