import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion } from "motion/react";
import emailjs from "@emailjs/browser";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";
import { designer } from "../data/content";

type FormValues = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

type RecaptchaRenderOptions = {
  sitekey: string;
  theme?: "dark" | "light";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type RecaptchaApi = {
  render: (container: HTMLElement, options: RecaptchaRenderOptions) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
  }
}

const initialValues: FormValues = {
  name: "",
  email: "",
  message: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RECAPTCHA_SCRIPT_URL =
  "https://www.google.com/recaptcha/api.js?render=explicit";

let recaptchaScriptPromise: Promise<RecaptchaApi> | null = null;

function validateForm(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  const trimmedName = values.name.trim();
  const trimmedEmail = values.email.trim();
  const trimmedMessage = values.message.trim();

  if (!trimmedName) {
    errors.name = "Name is required.";
  } else if (trimmedName.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (trimmedName.length > 80) {
    errors.name = "Name must be less than 80 characters.";
  }

  if (!trimmedEmail) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!trimmedMessage) {
    errors.message = "Project description is required.";
  } else if (trimmedMessage.length < 10) {
    errors.message = "Project description must be at least 10 characters.";
  } else if (trimmedMessage.length > 2000) {
    errors.message = "Project description must be less than 2000 characters.";
  }

  return errors;
}

function loadRecaptchaScript(): Promise<RecaptchaApi> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is not available."));
  }

  if (window.grecaptcha) {
    return Promise.resolve(window.grecaptcha);
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise<RecaptchaApi>((resolve, reject) => {
    const waitForRecaptcha = () => {
      let attempts = 0;

      const intervalId = window.setInterval(() => {
        if (window.grecaptcha) {
          window.clearInterval(intervalId);
          resolve(window.grecaptcha);
          return;
        }

        attempts += 1;

        if (attempts >= 50) {
          window.clearInterval(intervalId);
          reject(new Error("reCAPTCHA failed to load."));
        }
      }, 100);
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${RECAPTCHA_SCRIPT_URL}"]`,
    );

    if (existingScript) {
      waitForRecaptcha();
      return;
    }

    const script = document.createElement("script");
    script.src = RECAPTCHA_SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = waitForRecaptcha;
    script.onerror = () => reject(new Error("reCAPTCHA failed to load."));

    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

function getFriendlyEmailJsError(error: unknown): string {
  if (typeof error === "object" && error !== null) {
    const maybeStatus = "status" in error ? String(error.status) : "";
    const maybeText =
      "text" in error && typeof error.text === "string" ? error.text : "";

    if (maybeStatus === "429" || /rate limit|too many/i.test(maybeText)) {
      return "Too many messages were attempted too quickly. Please wait a few seconds and try again.";
    }

    if (/captcha|recaptcha/i.test(maybeText)) {
      return "reCAPTCHA verification failed. Please complete the checkbox again and retry.";
    }
  }

  return "Failed to send your inquiry. Please try again in a moment.";
}

type RecaptchaVerificationProps = {
  siteKey: string;
  resetSignal: number;
  onVerify: (token: string) => void;
  onExpire: () => void;
  onError: () => void;
};

function RecaptchaVerification({
  siteKey,
  resetSignal,
  onVerify,
  onExpire,
  onError,
}: RecaptchaVerificationProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    loadRecaptchaScript()
      .then((grecaptcha) => {
        if (
          !isMounted ||
          !containerRef.current ||
          widgetIdRef.current !== null
        ) {
          return;
        }

        widgetIdRef.current = grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          theme: "dark",
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
        });
      })
      .catch(() => {
        if (isMounted) {
          onError();
        }
      });

    return () => {
      isMounted = false;
    };
  }, [siteKey, onVerify, onExpire, onError]);

  useEffect(() => {
    if (widgetIdRef.current === null || !window.grecaptcha) {
      return;
    }

    window.grecaptcha.reset(widgetIdRef.current);
  }, [resetSignal]);

  return (
    <div className="recaptcha-box">
      <div ref={containerRef} />
    </div>
  );
}

export function ContactSection() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [captchaToken, setCaptchaToken] = useState("");
  const [captchaError, setCaptchaError] = useState("");
  const [captchaResetSignal, setCaptchaResetSignal] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false);

  const emailJsConfig = useMemo(
    () => ({
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined,
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID as
        | string
        | undefined,
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined,
      recaptchaSiteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY as
        | string
        | undefined,
    }),
    [],
  );

  useEffect(() => {
    if (!isSuccessPopupOpen) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setIsSuccessPopupOpen(false);
    }, 3500);

    return () => window.clearTimeout(timeoutId);
  }, [isSuccessPopupOpen]);

  const resetCaptcha = useCallback(() => {
    setCaptchaToken("");
    setCaptchaResetSignal((currentValue) => currentValue + 1);
  }, []);

  const handleCaptchaVerify = useCallback((token: string) => {
    setCaptchaToken(token);
    setCaptchaError("");
    setSubmitError("");
  }, []);

  const handleCaptchaExpire = useCallback(() => {
    setCaptchaToken("");
    setCaptchaError("reCAPTCHA expired. Please verify again.");
  }, []);

  const handleCaptchaError = useCallback(() => {
    setCaptchaToken("");
    setCaptchaError(
      "reCAPTCHA could not load. Please refresh the page and try again.",
    );
  }, []);

  const handleChange =
    (field: keyof FormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValue = event.target.value;

      setValues((prev) => ({
        ...prev,
        [field]: nextValue,
      }));

      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));

      setSubmitError("");
    };

  const handleBlur = (field: keyof FormValues) => () => {
    const nextErrors = validateForm(values);

    setErrors((prev) => ({
      ...prev,
      [field]: nextErrors[field],
    }));
  };

  const closeSuccessPopup = () => {
    setIsSuccessPopupOpen(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSubmitError("");

    const normalizedValues: FormValues = {
      name: values.name.trim(),
      email: values.email.trim(),
      message: values.message.trim(),
    };

    const validationErrors = validateForm(normalizedValues);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    if (
      !emailJsConfig.serviceId ||
      !emailJsConfig.templateId ||
      !emailJsConfig.publicKey ||
      !emailJsConfig.recaptchaSiteKey
    ) {
      setSubmitError(
        "Email service is not configured yet. Add your EmailJS and reCAPTCHA values to the .env file and restart the app.",
      );
      return;
    }

    if (!captchaToken) {
      setCaptchaError("Please complete the reCAPTCHA checkbox before sending.");
      return;
    }

    setIsSubmitting(true);

    try {
      await emailjs.send(
        emailJsConfig.serviceId,
        emailJsConfig.templateId,
        {
          to_email: designer.email,
          from_name: normalizedValues.name,
          from_email: normalizedValues.email,
          reply_to: normalizedValues.email,
          project_message: normalizedValues.message,
          "g-recaptcha-response": captchaToken,
        },
        {
          publicKey: emailJsConfig.publicKey,
        },
      );

      setValues(initialValues);
      setErrors({});
      setSubmitError("");
      setCaptchaError("");
      resetCaptcha();
      setIsSuccessPopupOpen(true);
    } catch (error) {
      console.error("Failed to send inquiry:", error);
      setSubmitError(getFriendlyEmailJsError(error));
      resetCaptcha();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-28">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mx-auto max-w-xl sm:mx-0"
          >
            <SectionHeading
              eyebrow="Contact Me"
              title="Let’s create interiors that feel unforgettable."
              description="Use this section to encourage project inquiries, collaborations, or freelance design consultations."
              align="left"
            />

            <div className="contact-intro-image-wrap">
              <img
                src="/images/contactmeimage.png"
                alt="Interior design contact preview"
                className="contact-intro-image"
                draggable={false}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="glass-panel p-6 sm:p-8"
          >
            <div className="mb-8 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="theme-meta mb-2 text-xs uppercase tracking-[0.35em]">
                  Email
                </p>
                <a
                  href={`mailto:${designer.email}`}
                  className="text-lg font-semibold text-white transition-opacity hover:opacity-80"
                >
                  {designer.email}
                </a>
              </div>

              <div>
                <p className="theme-meta mb-2 text-xs uppercase tracking-[0.35em]">
                  Phone
                </p>
                <a
                  href={`tel:${designer.phone.replace(/\s+/g, "")}`}
                  className="text-lg font-semibold text-white transition-opacity hover:opacity-80"
                >
                  {designer.phone}
                </a>
              </div>

              <div className="sm:col-span-2">
                <p className="theme-meta mb-2 text-xs uppercase tracking-[0.35em]">
                  Location
                </p>
                <p className="text-lg font-semibold text-white">
                  {designer.location}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="input-field"
                  value={values.name}
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  autoComplete="name"
                  minLength={2}
                  maxLength={80}
                  required
                />
                {errors.name ? (
                  <p
                    id="contact-name-error"
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Your email"
                  className="input-field"
                  value={values.email}
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  autoComplete="email"
                  maxLength={120}
                  required
                />
                {errors.email ? (
                  <p
                    id="contact-email-error"
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Tell me about your project"
                  className="input-field min-h-[140px] resize-none"
                  value={values.message}
                  onChange={handleChange("message")}
                  onBlur={handleBlur("message")}
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={
                    errors.message ? "contact-message-error" : undefined
                  }
                  minLength={10}
                  maxLength={2000}
                  required
                />
                {errors.message ? (
                  <p
                    id="contact-message-error"
                    className="mt-2 text-sm text-red-400"
                  >
                    {errors.message}
                  </p>
                ) : null}
              </div>

              {emailJsConfig.recaptchaSiteKey ? (
                <div>
                  <RecaptchaVerification
                    siteKey={emailJsConfig.recaptchaSiteKey}
                    resetSignal={captchaResetSignal}
                    onVerify={handleCaptchaVerify}
                    onExpire={handleCaptchaExpire}
                    onError={handleCaptchaError}
                  />

                  {captchaError ? (
                    <p className="mt-2 text-sm text-red-400" role="alert">
                      {captchaError}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {submitError ? (
                <div
                  className="contact-status-message contact-status-message--error"
                  role="alert"
                  aria-live="polite"
                >
                  {submitError}
                </div>
              ) : null}

              <button
                type="submit"
                className="primary-button min-w-[170px] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          </motion.div>
        </div>
      </Container>

      {isSuccessPopupOpen ? (
        <div
          className="contact-success-popup-backdrop"
          role="presentation"
          onClick={closeSuccessPopup}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="contact-success-popup"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-success-title"
            aria-describedby="contact-success-description"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="contact-success-popup__icon" aria-hidden="true">
              ✓
            </div>

            <h3
              id="contact-success-title"
              className="contact-success-popup__title"
            >
              Inquiry sent successfully
            </h3>

            <p
              id="contact-success-description"
              className="contact-success-popup__description"
            >
              Thank you for reaching out. Your message has been sent
              successfully.
            </p>

            <button
              type="button"
              className="primary-button min-w-[140px]"
              onClick={closeSuccessPopup}
            >
              Close
            </button>
          </motion.div>
        </div>
      ) : null}
    </section>
  );
}
