import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import emailjs from "@emailjs/browser";
import App from "./App";
import "./styles.css";

const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as
  | string
  | undefined;

if (emailJsPublicKey) {
  emailjs.init({
    publicKey: emailJsPublicKey,
    blockHeadless: true,
    limitRate: {
      id: "portfolio-contact-form",
      throttle: 10000,
    },
  });
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element was not found.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
