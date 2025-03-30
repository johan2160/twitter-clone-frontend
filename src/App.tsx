import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainPage from "./pages/MainPage";
import BookmarksPage from "./pages/BookmarksPage";
import NotificationsPage from "./pages/NotificationsPage";
import ProfilePage from "./pages/ProfilePage";
import SigninPage from "./pages/SigninPage";
import SignupPage from "./pages/SignupPage";
import { MainLayout } from "./layouts/MainLayout";
import { AuthLayout } from "./layouts/AuthLayout";
import { Toaster } from "sonner";
import { TanstackQueryProvider } from "./providers/TanstackQueryProvider";
import TestingPage from "./pages/TestingPage";
import { ColorsProvider } from "./components/colors-provider";

export default function App() {
  return (
    <TanstackQueryProvider>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <ColorsProvider>
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route element={<AuthLayout />}>
                <Route path="/signin" element={<SigninPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>

              {/* Protected routes */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<MainPage />} />
                <Route path="/bookmarks" element={<BookmarksPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/testing" element={<TestingPage />} />
              </Route>

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
        </ColorsProvider>
      </ThemeProvider>
    </TanstackQueryProvider>
  );
}
