import { motion } from "motion/react";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
  descriptionClassName?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  descriptionClassName = "",
}: SectionHeadingProps) {
  const isLeft = align === "left";

  const wrapperAlignmentClass = isLeft
    ? "mx-auto text-center sm:mx-0 sm:text-left"
    : "mx-auto text-center";

  const descriptionAlignmentClass = isLeft ? "mx-auto sm:mx-0" : "mx-auto";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`max-w-3xl ${wrapperAlignmentClass}`}
    >
      <p className="theme-eyebrow mb-4 text-sm uppercase tracking-[0.35em]">
        {eyebrow}
      </p>

      <h2 className="theme-heading text-3xl tracking-tight sm:text-4xl">
        {title}
      </h2>

      <p
        className={`theme-copy mt-4 text-base leading-7 sm:text-lg ${descriptionAlignmentClass} ${descriptionClassName}`}
      >
        {description}
      </p>
    </motion.div>
  );
}
