import { motion } from 'motion/react';
import { AnimatedCard } from '../components/AnimatedCard';
import { Container } from '../components/Container';
import { SectionHeading } from '../components/SectionHeading';
import { skills } from '../data/content';

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Core Skills"
          title="A balanced toolkit across design thinking, software, and presentation."
          description="The layout keeps the section simple and modern while adding interaction through hover motion and staggered entrance animations."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((skill, index) => (
            <AnimatedCard key={skill} delay={index * 0.05} className="p-5">
              <motion.div whileHover={{ x: 4 }} className="flex items-center justify-between gap-4">
                <span className="text-base font-medium text-zinc-200">{skill}</span>
                <span className="text-zinc-500">0{(index % 9) + 1}</span>
              </motion.div>
            </AnimatedCard>
          ))}
        </div>
      </Container>
    </section>
  );
}
