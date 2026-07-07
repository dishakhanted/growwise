import { FormEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "error-callback": () => void;
          "expired-callback": () => void;
        },
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "";
const IS_LOCALHOST =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");
const USE_TURNSTILE =
  TURNSTILE_SITE_KEY &&
  (!IS_LOCALHOST || import.meta.env.VITE_ENABLE_TURNSTILE_LOCAL === "true");

function getApiErrorMessage(errorResponse: { error?: string; message?: string }): string {
  return errorResponse.error || errorResponse.message || "Something went wrong. Please try again.";
}

interface AccessRequestFormProps {
  submitLabel?: string;
  emailPlaceholder?: string;
}

export const AccessRequestForm = ({
  submitLabel = "Request Access",
  emailPlaceholder = "Work email",
}: AccessRequestFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);
  const waitlistSupabaseUrl = import.meta.env.VITE_WAITLIST_SUPABASE_URL;

  useEffect(() => {
    if (IS_LOCALHOST && !USE_TURNSTILE) {
      setTurnstileToken("localhost-bypass-token");
      return;
    }

    if (!USE_TURNSTILE || !turnstileRef.current || !TURNSTILE_SITE_KEY) {
      return;
    }

    const renderTurnstile = () => {
      if (!turnstileRef.current || !window.turnstile) return;

      try {
        const widgetId = window.turnstile.render(turnstileRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          callback: (token: string) => setTurnstileToken(token),
          "error-callback": () => {
            setTurnstileToken(null);
            setStatus({ type: "error", message: "CAPTCHA verification failed. Please try again." });
          },
          "expired-callback": () => setTurnstileToken(null),
        });
        turnstileWidgetIdRef.current = widgetId;
      } catch {
        if (IS_LOCALHOST) setTurnstileToken("localhost-bypass-token");
      }
    };

    if (!window.turnstile) {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderTurnstile();
        }
      }, 100);
      return () => clearInterval(interval);
    }

    renderTurnstile();

    return () => {
      if (turnstileWidgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(turnstileWidgetIdRef.current);
        } catch {
          /* ignore */
        }
      }
    };
  }, []);

  const resetTurnstile = () => {
    if (turnstileWidgetIdRef.current && window.turnstile) {
      try {
        window.turnstile.reset(turnstileWidgetIdRef.current);
        setTurnstileToken(null);
      } catch {
        /* ignore */
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!waitlistSupabaseUrl) {
      setStatus({
        type: "error",
        message: "Access requests are temporarily unavailable. Please try again later.",
      });
      return;
    }

    const tokenToUse =
      IS_LOCALHOST && !USE_TURNSTILE ? "localhost-bypass-token" : turnstileToken;

    if (!tokenToUse && USE_TURNSTILE) {
      setStatus({ type: "error", message: "Please complete the CAPTCHA verification." });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${waitlistSupabaseUrl}/functions/v1/waitlist-submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: "Institutional",
          last_name: "Access",
          birthday: "2000-01-01",
          email: email.trim(),
          turnstile_token: tokenToUse || "localhost-bypass-token",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          throw new Error(
            data.error || "This email is already registered. We'll be in touch shortly.",
          );
        }
        throw new Error(getApiErrorMessage(data));
      }

      setEmail("");
      setStatus({
        type: "success",
        message: data.message || "Request received. Our team will be in touch.",
      });
      resetTurnstile();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
      resetTurnstile();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="work-email" className="sr-only">
          Work email
        </Label>
        <Input
          id="work-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (status?.type === "error") setStatus(null);
          }}
          required
          placeholder={emailPlaceholder}
          className="h-12"
        />
      </div>

      {USE_TURNSTILE && (
        <div className="flex justify-center">
          <div ref={turnstileRef} />
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold"
        disabled={isSubmitting || !waitlistSupabaseUrl || (USE_TURNSTILE && !turnstileToken)}
      >
        {isSubmitting ? "Submitting..." : submitLabel}
      </Button>

      {status && (
        <Alert variant={status.type === "error" ? "destructive" : "default"} aria-live="polite">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
    </form>
  );
};
