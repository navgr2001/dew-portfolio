import { motion } from "motion/react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  mobileJustify?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  mobileJustify = false,
}: SectionHeadingProps) {
  const isLeft = align === "left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`max-w-3xl ${isLeft ? "text-left" : "mx-auto text-center"} ${
        mobileJustify ? "mobile-justify-content" : ""
      }`}
    >
      <p className="theme-eyebrow mb-4 text-sm uppercase tracking-[0.35em]">
        {eyebrow}
      </p>

      <h2 className="theme-heading text-3xl tracking-tight sm:text-4xl">
        {title}
      </h2>

      <p
        className={`theme-copy mt-4 text-base leading-7 sm:text-lg ${
          isLeft ? "" : "mx-auto"
        }`}
      >
        {description}
      </p>
    </motion.div>
  );
}
