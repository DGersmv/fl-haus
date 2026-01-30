"use client";
import { motion } from "framer-motion";
import React from "react";

function SplitChinaHeadline({ text }: { text: string }) {
  return (
    <h2
      className="font-extrabold text-[clamp(1.8rem,5vw,2.8rem)] mb-6"
      style={{
        fontFamily: "'Montserrat', Arial, sans-serif",
        letterSpacing: "0.04em",
        background: "linear-gradient(90deg, #faecd1 0%, #d3a373 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        display: "inline-block",
        lineHeight: 1.1,
      }}
    >
      {Array.from(text).map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: i * 0.05,
            duration: 0.66,
            ease: [0.62, 0.14, 0.42, 1.12],
          }}
          style={{ display: "inline-block", marginRight: char === " " ? 8 : 0 }}
        >
          {char}
        </motion.span>
      ))}
    </h2>
  );
}

export default function CompanyDescription() {
  const variants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      className="text-white flex flex-col space-y-6 text-left"
      style={{
        width: "100%",
        fontFamily: "'Montserrat Alternates', sans-serif",
        marginLeft: 0,
        alignSelf: "flex-start",
      }}
      initial="hidden"
      animate="visible"
      transition={{ staggerChildren: 0.2 }}
    >
      <SplitChinaHeadline text="Ландшафт, который рекомендуют" />

      <motion.p variants={variants} className="font-semibold">
        Нам доверяют уже более 15 лет
      </motion.p>
      <motion.p variants={variants}>
        90% наших клиентов приходят по личным рекомендациям — потому что мы создаём
      </motion.p>
      <motion.p variants={variants}>
        не просто красивые пространства, а действительно комфортные и функциональные
      </motion.p>
      <motion.p variants={variants}>
        участки, которые работают на ваш стиль жизни.
      </motion.p>

      <motion.p variants={variants} className="mt-2 font-semibold">
        Мы умеем решать сложные задачи:
      </motion.p>
      <motion.ul variants={variants} className="list-disc pl-6 space-y-2">
        <li>Перепады высот, затопление, сложные грунты — решаем.</li>
        <li>Индивидуальный подход: отражение вкусов и привычек клиента.</li>
        <li>Подбор растений по цвету, простоте ухода и эксклюзивности.</li>
        <li>Ориентация только на реальные примеры в нашем климате.</li>
      </motion.ul>

      <motion.p variants={variants}>Наши принципы: логика, функциональность, эстетика.</motion.p>
      <motion.p variants={variants} className="font-semibold">
        Личный онлайн-кабинет заказчика
      </motion.p>
      <motion.p variants={variants}>
        Все этапы, документы, фото- и видеоотчёты, комментарии — в одном месте, с любого устройства.
      </motion.p>

      <motion.p variants={variants}>Мы ведём проект от первого выезда до сдачи и последующего сервиса.</motion.p>
      <motion.p variants={variants}>
        Архитектурное образование и опыт позволяют принимать грамотные решения на всех стадиях.
      </motion.p>
      <motion.p variants={variants}>
        Экономим бюджет за счёт продуманной последовательности и прозрачных процессов.
      </motion.p>
      <motion.p variants={variants} className="font-semibold">
        Вы получаете не просто проект, а надёжного партнёра на всех этапах.
      </motion.p>
    </motion.div>
  );
}
