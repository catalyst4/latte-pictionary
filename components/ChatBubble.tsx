import type { ReactNode } from "react";

export type ChatBubbleSide = "left" | "right";

export type ChatBubbleTail =
  /** Bubble tail points down-left (rounded on tl, tr, br). */
  | "bottom-left"
  /** Bubble tail points down-right (rounded on tl, tr, bl). */
  | "bottom-right";

export type ChatBubbleProps = {
  /** Player name shown above the bubble. */
  playerName: string;
  /** Guess text inside the bubble. */
  children: ReactNode;
  /** Background fill (Figma uses pastels e.g. #ffa5af). */
  backgroundColor: string;
  /** Align the name + bubble column. */
  side: ChatBubbleSide;
  /** Which corner gets the “tail” rounding pattern. */
  tail: ChatBubbleTail;
  className?: string;
};

const tailRoundedClass: Record<ChatBubbleTail, string> = {
  "bottom-left": "rounded-br-[16px] rounded-tl-[16px] rounded-tr-[16px]",
  "bottom-right": "rounded-bl-[16px] rounded-tl-[16px] rounded-tr-[16px]",
};

/**
 * Chat-style guess bubble (Figma: name label + rounded bubble + shadow).
 * Not wired into screens yet — export for future use.
 */
export function ChatBubble({
  playerName,
  children,
  backgroundColor,
  side,
  tail,
  className,
}: ChatBubbleProps) {
  const nameAlign =
    side === "right" ? "text-right" : "text-left";
  const itemsAlign = side === "right" ? "items-end" : "items-start";

  return (
    <div
      className={`flex w-max max-w-full flex-col gap-0.5 ${itemsAlign} ${className ?? ""}`}
      data-component="ChatBubble"
    >
      <p
        className={`w-full max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[13px] font-medium leading-4 text-[#1a1a1a] ${nameAlign}`}
      >
        {playerName}
      </p>
      <div
        className={`flex min-h-0 w-full items-center justify-center p-2.5 shadow-[0_4px_2px_rgba(0,0,0,0.25)] ${tailRoundedClass[tail]}`}
        style={{ backgroundColor }}
      >
        <p className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-sans text-[17px] font-medium leading-4 text-[#1a1a1a]">
          {children}
        </p>
      </div>
    </div>
  );
}
