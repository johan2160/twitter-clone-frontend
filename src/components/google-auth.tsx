import { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authClient } from '@/lib/auth-client';

declare global {
  interface Window {
    google: any;
  }
}

export function GoogleAuth() {
  const navigate = useNavigate();
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handleCredentialResponse = useCallback(async (response: any) => {
    try {
      await authClient.signIn.social({
        provider: "google",
        idToken: {
          token: response.credential
        }
      });
      navigate('/');
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Failed to sign in with Google');
    }
  }, [navigate]);

  useEffect(() => {
    // Check if script is already loaded
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      setIsScriptLoaded(true);
      return;
    }

    // Load the Google Identity Services script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setIsScriptLoaded(true);
    script.onerror = () => {
      console.error('Failed to load Google Identity Services script');
      toast.error('Failed to load Google Sign-In');
    };
    document.head.appendChild(script);

    return () => {
      // Only remove the script if we added it
      if (!existingScript) {
        const scriptToRemove = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (!isScriptLoaded || !window.google || isInitialized) return;

    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
        ux_mode: 'popup',
      });

      const buttonElement = document.getElementById('google-signin');
      if (buttonElement) {
        window.google.accounts.id.renderButton(buttonElement, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'rectangular',
          width: 320,
          locale: 'en'
        });
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      toast.error('Failed to initialize Google Sign-In');
    }
  }, [isScriptLoaded, handleCredentialResponse, isInitialized]);

  return (
    <div id="google-signin" className="flex justify-center">
      {!isScriptLoaded && (
        <div className="h-10 w-[320px] bg-accent/10 animate-pulse rounded-md"></div>
      )}
    </div>
  );
}
