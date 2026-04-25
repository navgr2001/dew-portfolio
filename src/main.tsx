import React from "react";
import ReactDOM from "react-dom/client";
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
