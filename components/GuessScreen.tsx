"use client";

import { ChatBubble } from "@/components/ChatBubble";
import { GuessDrawingArea } from "@/components/GuessDrawingArea";
import { Silkscreen } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const pixel = Silkscreen({
  weight: "400",
  subsets: ["latin"],
});

const AVATARS = [
  { letter: "O", bg: "#ffa5af", text: "text-white" },
  { letter: "D", bg: "#fed498", text: "text-[#111928]" },
  { letter: "J", bg: "#b885da", text: "text-white" },
  { letter: "S", bg: "#cce9b1", text: "text-white" },
] as const;

type MockGuess = {
  id: string;
  playerName: string;
  guess: string;
  backgroundColor: string;
  isLeaving: boolean;
};

const GUESS_REVEAL_DELAY_MS = 900;
const GUESS_REVEAL_INTERVAL_MS = 2200;
const GUESS_VISIBLE_DURATION_MS = 5200;
const GUESS_FADE_DURATION_MS = 600;

const MOCK_GUESS_POOL = [
  { playerName: "Olivia", guess: "a latte?", backgroundColor: "#ffa5af" },
  { playerName: "Drew", guess: "coffee cup", backgroundColor: "#fed498" },
  { playerName: "Jess", guess: "cat?", backgroundColor: "#b885da" },
  { playerName: "Sam", guess: "mug", backgroundColor: "#cce9b1" },
  { playerName: "Mina", guess: "matcha!", backgroundColor: "#b9d7f4" },
  { playerName: "Leo", guess: "tiny cloud", backgroundColor: "#f7c6e7" },
  { playerName: "Ari", guess: "pancake?", backgroundColor: "#f6e6a8" },
] as const;

function getRandomMockGuesses(limit = 5): MockGuess[] {
  const shuffled = [...MOCK_GUESS_POOL];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, limit).map((guess, index) => ({
    ...guess,
    id: `${guess.playerName}-${guess.guess}-${index}`,
    isLeaving: false,
  }));
}

/**
 * Guess screen shell (Figma node 2262:1580). Omits iOS status bar and keyboard mock.
 * Mug + prompt-to-draw flow lives in `GuessDrawingArea` (client).
 */
export function GuessScreen() {
  const [headerTitle, setHeaderTitle] = useState<"GUESS" | "DRAW">("GUESS");
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const [visibleGuesses, setVisibleGuesses] = useState<MockGuess[]>([]);

  const onPhaseChange = useCallback((phase: "prompt" | "draw") => {
    const nextIsDrawing = phase === "draw";

    setHeaderTitle(nextIsDrawing ? "DRAW" : "GUESS");
    setIsDrawing(nextIsDrawing);
    setHasStartedDrawing(false);
    setVisibleGuesses([]);
  }, []);

  const onDrawingStart = useCallback(() => {
    setHasStartedDrawing(true);
  }, []);

  useEffect(() => {
    if (!isDrawing || !hasStartedDrawing) return;

    const guesses = getRandomMockGuesses();
    const timers = guesses.flatMap((guess, index) => {
      const showAt = GUESS_REVEAL_DELAY_MS + index * GUESS_REVEAL_INTERVAL_MS;

      return [
        window.setTimeout(() => {
          setVisibleGuesses((current) => [...current, guess]);
        }, showAt),
        window.setTimeout(() => {
          setVisibleGuesses((current) =>
            current.map((currentGuess) =>
              currentGuess.id === guess.id
                ? { ...currentGuess, isLeaving: true }
                : currentGuess,
            ),
          );
        }, showAt + GUESS_VISIBLE_DURATION_MS),
        window.setTimeout(() => {
          setVisibleGuesses((current) =>
            current.filter((currentGuess) => currentGuess.id !== guess.id),
          );
        }, showAt + GUESS_VISIBLE_DURATION_MS + GUESS_FADE_DURATION_MS),
      ];
    });

    return () => {
      timers.forEach(window.clearTimeout);
    };
  }, [hasStartedDrawing, isDrawing]);

  return (
    <div
      className="relative flex min-h-dvh w-full min-w-0 flex-col overflow-x-hidden bg-white font-sans"
      data-node-id="2262:1580"
    >
      {/* Collage background (same treatment as entry) */}
      <div className="pointer-events-none absolute inset-0 min-h-dvh overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -left-[16.45%] -top-[25.05%] h-[125.05%] w-[166.2%]">
            <Image
              alt=""
              src="/assets/collage-bg.png"
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </div>
      </div>

      {/* Top nav: no system status bar — only title row + blur */}
      <header className="relative z-10 w-full shrink-0 px-2 pt-[max(8px,env(safe-area-inset-top,0px))]">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[72px] overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 backdrop-blur-[25px]" />
        </div>
        <div className="relative flex h-11 w-full items-center">
          <div className="flex h-11 shrink-0 items-center pl-1">
            <Link
              href="/"
              className="flex size-11 items-center justify-center font-sans text-[34px] font-medium leading-none text-[#007aff]"
              aria-label="Back to home"
            >
              ‹
            </Link>
          </div>
          <h1
            className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[24px] leading-[22px] tracking-[-0.43px] text-black ${pixel.className}`}
          >
            {headerTitle}
          </h1>
          <div className="ml-auto flex shrink-0 items-center pr-4">
            {AVATARS.map((a, i) => (
              <div
                key={a.letter}
                className={`relative flex size-7 items-center justify-center rounded-full border-2 border-white font-sans text-[14px] font-semibold leading-none ${a.text} ${i > 0 ? "-ml-2" : ""}`}
                style={{ backgroundColor: a.bg, zIndex: AVATARS.length - i }}
                aria-hidden
              >
                <span className="block leading-none">{a.letter}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {visibleGuesses.length > 0 ? (
        <div
          className="pointer-events-none absolute inset-x-0 top-[calc(max(8px,env(safe-area-inset-top,0px))_+_56px)] z-20 flex justify-center px-4"
          aria-label="Mock guess chat"
          aria-live="polite"
        >
          <div className="flex w-full max-w-[390px] flex-col gap-2">
            {visibleGuesses.map((guess, index) => {
              const side = index % 2 === 0 ? "left" : "right";

              return (
                <ChatBubble
                  key={guess.id}
                  playerName={guess.playerName}
                  backgroundColor={guess.backgroundColor}
                  side={side}
                  tail={side === "left" ? "bottom-left" : "bottom-right"}
                  className={`max-w-[62%] transition-all duration-[600ms] ease-out ${guess.isLeaving ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"} ${side === "right" ? "self-end" : "self-start"}`}
                >
                  {guess.guess}
                </ChatBubble>
              );
            })}
          </div>
        </div>
      ) : null}

      <GuessDrawingArea
        onDrawingStart={onDrawingStart}
        onPhaseChange={onPhaseChange}
      />
    </div>
  );
}
