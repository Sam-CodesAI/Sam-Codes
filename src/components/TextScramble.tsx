"use client";

import React, { useState, useEffect, useCallback } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________010101";

interface TextScrambleProps {
  text: string;
  className?: string;
  scrambleOnHover?: boolean;
  triggerKey?: string | number;
}

export default function TextScramble({
  text,
  className = "",
  scrambleOnHover = true,
  triggerKey,
}: TextScrambleProps) {
  const [displayText, setDisplayText] = useState(text);
  const [isScrambling, setIsScrambling] = useState(false);

  const scramble = useCallback(() => {
    if (isScrambling) return;
    setIsScrambling(true);

    let iteration = 0;
    const length = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= length) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }

      iteration += 1 / 2;
    }, 28);
  }, [text, isScrambling]);

  useEffect(() => {
    scramble();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerKey]);

  return (
    <span
      onMouseEnter={scrambleOnHover ? scramble : undefined}
      className={`font-mono cursor-default inline-block ${className}`}
    >
      {displayText}
    </span>
  );
}
