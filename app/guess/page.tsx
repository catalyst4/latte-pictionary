import type { Metadata } from "next";
import { GuessScreen } from "@/components/GuessScreen";

export const metadata: Metadata = {
  title: "Guess — Latte Pictionary",
  description: "Make your guess in Latte Pictionary.",
};

export default function GuessPage() {
  return <GuessScreen />;
}
