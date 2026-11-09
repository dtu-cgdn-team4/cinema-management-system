import { useEffect, useRef, useState } from 'react';
import { getAuthConfig, googleLoginApi } from '../api/authApi';
import type { AuthResponse } from '../types';
import { errorMessage } from '../../../services/api';

interface GoogleApi {
  accounts: {
    id: {
      initialize: (options: {
        client_id: string;
        callback: (response: { credential: string }) => void;
        auto_select?: boolean;
      }) => void;
      prompt: (notification?: (notification: unknown) => void) => void;
      renderButton: (
        element: HTMLElement,
        options: {
          theme?: 'outline' | 'filled_blue' | 'filled_black';
          size?: 'small' | 'medium' | 'large';
          text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
          shape?: 'rectangular' | 'pill' | 'circle';
          width?: number;
          logo_alignment?: 'left' | 'center';
        }
      ) => void;
    };
  };
}

declare global {
  interface Window {
    google?: GoogleApi;
  }
}

let scriptPromise: Promise<void> | undefined;
function loadGoogle(): Promise<void> {
  if (window.google) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Google SDK load error')));
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client?hl=vi';
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        script.remove();
        scriptPromise = undefined;
        reject(new Error('Google unavailable'));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

export function GoogleLoginButton({
  rememberMe,
  disabled,
  onSuccess,
  onError,
  onBusyChange,
}: {
  rememberMe: boolean;
  disabled: boolean;
  onSuccess: (session: AuthResponse) => void;
  onError: (message: string) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const latest = useRef({ rememberMe, disabled, onSuccess, onError, onBusyChange });
  latest.current = { rememberMe, disabled, onSuccess, onError, onBusyChange };

  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const googleBtnContainerRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const config = await getAuthConfig();
        if (!config.googleClientId || !active) return;

        await loadGoogle();
        if (!active || !window.google) return;

        window.google.accounts.id.initialize({
          client_id: config.googleClientId,
          callback: async ({ credential }) => {
            if (!active || latest.current.disabled || busyRef.current) return;
            busyRef.current = true;
            setBusy(true);
            latest.current.onBusyChange(true);

            try {
              const session = await googleLoginApi(credential, latest.current.rememberMe);
              if (active) latest.current.onSuccess(session);
            } catch (error) {
              if (active) latest.current.onError(errorMessage(error));
            } finally {
              busyRef.current = false;
              if (active) {
                setBusy(false);
                latest.current.onBusyChange(false);
              }
            }
          },
        });

        if (googleBtnContainerRef.current) {
          googleBtnContainerRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'rectangular',
            width: 400,
            logo_alignment: 'left',
          });
          setLoaded(true);
        }
      } catch {
        // Fallback silently if offline or blocked
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center min-h-[44px]">
      {/* Container nút chính thức của Google GSI (popup hoạt động trên mọi trình duyệt & Incognito) */}
      <div
        ref={googleBtnContainerRef}
        className={`w-full flex justify-center ${disabled || busy ? 'pointer-events-none opacity-60' : ''} ${!loaded ? 'hidden' : ''}`}
      />

      {/* Placeholder trong khi SDK Google đang tải */}
      {!loaded && (
        <div className="w-full py-2.5 px-4 bg-[#10141d]/80 border border-[#232936] text-white font-medium text-sm rounded-xl flex items-center justify-center gap-3 shadow-sm">
          <span className="font-serif font-medium text-lg leading-none text-white tracking-normal">
            G
          </span>
          <span className="text-sm font-medium tracking-wide text-[#8e95a5]">
            {busy ? 'Đang kết nối Google...' : 'Tiếp tục với Google'}
          </span>
        </div>
      )}
    </div>
  );
}
