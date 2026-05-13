"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Phase = "prompt" | "draw";

type MatchaStar = {
  src: "/assets/star-1.svg" | "/assets/star-2.svg";
  left: number;
  top: number;
  size: number;
  drift: number;
  rotate: number;
  delay: number;
  duration: number;
};

type MatchaStarStyle = React.CSSProperties & {
  "--matcha-star-drift": string;
  "--matcha-star-rotate": string;
  "--matcha-star-start-rotate": string;
};

const MATCHA_STARS = [
  { src: "/assets/star-2.svg", left: -7, top: 416, size: 24, drift: -16, rotate: -18, delay: 20, duration: 1900 },
  { src: "/assets/star-1.svg", left: 271, top: 589, size: 49, drift: 24, rotate: 16, delay: 180, duration: 2200 },
  { src: "/assets/star-1.svg", left: 102, top: 590, size: 49, drift: -20, rotate: -10, delay: 110, duration: 2100 },
  { src: "/assets/star-1.svg", left: 93, top: 106, size: 49, drift: 16, rotate: 14, delay: 80, duration: 1900 },
  { src: "/assets/star-1.svg", left: 31, top: 319, size: 56, drift: -26, rotate: -14, delay: 260, duration: 2300 },
  { src: "/assets/star-1.svg", left: 295, top: 289, size: 49, drift: 18, rotate: 18, delay: 140, duration: 2000 },
  { src: "/assets/star-1.svg", left: 200, top: 135, size: 56, drift: -18, rotate: -18, delay: 210, duration: 2300 },
  { src: "/assets/star-2.svg", left: 38, top: 223, size: 42, drift: 22, rotate: 12, delay: 60, duration: 2000 },
  { src: "/assets/star-1.svg", left: 320, top: 155, size: 49, drift: 28, rotate: -12, delay: 310, duration: 2200 },
  { src: "/assets/star-1.svg", left: 142, top: 427, size: 49, drift: -14, rotate: 18, delay: 230, duration: 2100 },
  { src: "/assets/star-1.svg", left: 150, top: 540, size: 49, drift: 18, rotate: -16, delay: 330, duration: 2300 },
  { src: "/assets/star-1.svg", left: 214, top: 347, size: 56, drift: -22, rotate: 10, delay: 40, duration: 2200 },
  { src: "/assets/star-2.svg", left: 360, top: 256, size: 33, drift: 16, rotate: 18, delay: 270, duration: 1900 },
  { src: "/assets/star-1.svg", left: 62, top: 45, size: 49, drift: -18, rotate: -12, delay: 150, duration: 2100 },
  { src: "/assets/star-1.svg", left: 252, top: 436, size: 49, drift: 26, rotate: 14, delay: 90, duration: 2200 },
  { src: "/assets/star-1.svg", left: 301, top: 460, size: 49, drift: -16, rotate: -18, delay: 380, duration: 2400 },
  { src: "/assets/star-1.svg", left: -7, top: 549, size: 56, drift: 22, rotate: 12, delay: 300, duration: 2300 },
] satisfies readonly MatchaStar[];

function getMatchaStarStyle(star: MatchaStar): MatchaStarStyle {
  return {
    left: star.left,
    top: star.top,
    width: star.size,
    height: star.size,
    "--matcha-star-drift": `${star.drift}px`,
    "--matcha-star-rotate": `${star.rotate}deg`,
    "--matcha-star-start-rotate": `${star.rotate * -0.35}deg`,
    animationDelay: `${star.delay}ms`,
    animationDuration: `${star.duration}ms`,
  };
}

function BrushIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M4 20h4l10.5-10.5a2.5 2.5 0 0 0-3.5-3.5L4.5 16.5V20Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M13.5 6.5 17.5 10.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Paint-bucket / fill tool (Figma matcha toolbar center). */
function FillBucketIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M8 3h8l1 4v3H7V7l1-4Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M6 10h12v8a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3v-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M12 14v4"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EraserIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="m7 21-4.5-4.5c-.6-.6-.6-1.5 0-2.1l9.9-9.9c.6-.6 1.5-.6 2.1 0l7.1 7.1c.6.6.6 1.5 0 2.1L13 21"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 21h10"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MatchaStarBurst() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[calc(100dvh-150px)] overflow-hidden"
      aria-hidden
    >
      <div className="relative mx-auto h-[594px] w-full max-w-[400px]">
        {MATCHA_STARS.map((star, index) => (
          <div
            key={`${star.left}-${star.top}-${index}`}
            className="matcha-star absolute"
            style={getMatchaStarStyle(star)}
          >
            <Image
              src={star.src}
              alt=""
              fill
              className="object-contain"
              sizes={`${star.size}px`}
              unoptimized
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export type GuessDrawingAreaProps = {
  onPhaseChange?: (phase: Phase) => void;
};

/**
 * Mug + coffee circle with optional drawing canvas, and bottom prompt / toolbar flow.
 */
export function GuessDrawingArea(props: GuessDrawingAreaProps = {}) {
  const { onPhaseChange } = props;
  const [phase, setPhase] = useState<Phase>("prompt");
  const [prompt, setPrompt] = useState("");
  const [draft, setDraft] = useState("");
  const [isMatchaMode, setIsMatchaMode] = useState(false);
  const [matchaBurstId, setMatchaBurstId] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const lastRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    onPhaseChange?.(phase);
  }, [phase, onPhaseChange]);

  const syncCanvasSize = useCallback(() => {
    const wrap = circleRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const { width, height } = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(width * dpr));
    const h = Math.max(1, Math.floor(height * dpr));
    if (canvas.width === w && canvas.height === h) return;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  useEffect(() => {
    if (phase !== "draw") return;
    syncCanvasSize();
    const wrap = circleRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(() => {
      syncCanvasSize();
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
    };
  }, [phase, isMatchaMode, syncCanvasSize]);

  const getCtx = () => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    return canvas.getContext("2d");
  };

  const clientToCanvas = (clientX: number, clientY: number) => {
    const wrap = circleRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return null;
    const rect = wrap.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    if (x < 0 || y < 0 || x > rect.width || y > rect.height) return null;
    return { x, y };
  };

  const drawSegment = (from: { x: number; y: number }, to: { x: number; y: number }) => {
    const ctx = getCtx();
    if (!ctx) return;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3.25;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "draw") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = clientToCanvas(e.clientX, e.clientY);
    if (!pt) return;
    drawingRef.current = true;
    lastRef.current = pt;
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (phase !== "draw" || !drawingRef.current) return;
    const pt = clientToCanvas(e.clientX, e.clientY);
    if (!pt) return;
    const last = lastRef.current;
    if (last) {
      drawSegment(last, pt);
    }
    lastRef.current = pt;
  };

  const endStroke = () => {
    drawingRef.current = false;
    lastRef.current = null;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    endStroke();
  };

  const submitPrompt = () => {
    const trimmed = draft.trim();
    if (!trimmed) return;
    setPrompt(trimmed);
    setPhase("draw");
  };

  const toggleMatchaMode = () => {
    if (!isMatchaMode) {
      setMatchaBurstId((id) => id + 1);
    }
    setIsMatchaMode((v) => !v);
  };

  const circleColor = isMatchaMode ? "bg-[#8aa46a]" : "bg-[#8b6f52]";
  const toolbarColor = isMatchaMode ? "bg-[#e9f0d5]" : "bg-[#f7f4e7]";
  const inactiveToolColor = isMatchaMode ? "bg-[#d6e5bb]" : "bg-[#e8e4d4]";
  const activeToolColor = isMatchaMode ? "bg-[#6f8750]" : "bg-[#6b7a4e]";

  return (
    <>
      {matchaBurstId > 0 ? <MatchaStarBurst key={matchaBurstId} /> : null}

      <div className="relative z-[1] flex min-h-0 flex-1 flex-col items-center justify-center px-4 pb-2 pt-4">
        <div
          className="relative isolate aspect-square w-[min(100%,360px)] max-w-[360px] shrink-0"
          aria-label="Mug and drawing area"
        >
          <Image
            src="/assets/mug-top.png"
            alt=""
            fill
            className="object-contain mix-blend-screen"
            sizes="(max-width: 768px) 92vw, 360px"
            priority
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div
              ref={circleRef}
              className={`relative aspect-square w-[82%] overflow-hidden rounded-full ${circleColor} shadow-[inset_0_-4px_12px_rgba(0,0,0,0.12)]`}
            >
              {phase === "draw" ? (
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 size-full touch-none"
                  style={{ touchAction: "none" }}
                  aria-label="Drawing surface"
                  onPointerDown={onPointerDown}
                  onPointerMove={onPointerMove}
                  onPointerUp={onPointerUp}
                  onPointerCancel={onPointerUp}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-auto w-full shrink-0 pb-[max(10px,env(safe-area-inset-bottom,0px))]">
        {phase === "prompt" ? (
          <div className="flex w-full items-center gap-2.5 bg-[#f7f4e7] p-2.5">
            <label htmlFor="draw-prompt-input" className="sr-only">
              What you will draw
            </label>
            <div className="relative flex min-h-[35px] min-w-0 flex-1 items-center rounded-md pl-2 pr-1">
              <div
                className="pointer-events-none absolute inset-0 rounded-md bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                aria-hidden
              />
              <input
                id="draw-prompt-input"
                name="drawPrompt"
                type="text"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    submitPrompt();
                  }
                }}
                placeholder="Name what you’ll draw"
                autoComplete="off"
                className="relative z-10 min-w-0 flex-1 bg-transparent py-2 font-sans text-[17px] font-medium leading-4 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40"
              />
            </div>
            <button
              type="button"
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#e6d99c]"
              aria-label="Continue to drawing"
              onClick={submitPrompt}
            >
              <Image
                src="/assets/send-plane.svg"
                alt=""
                width={24}
                height={24}
                className="size-6 object-contain"
                unoptimized
              />
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-stretch">
            <div className="flex justify-center bg-transparent px-4 pb-3 pt-3">
              <div className="relative flex h-14 w-full max-w-[317px] items-center rounded-md px-2">
                <div
                  className="pointer-events-none absolute inset-0 rounded-md bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.08)]"
                  aria-hidden
                />
                <p className="relative z-10 min-w-0 flex-1 overflow-hidden text-center font-sans text-[17px] font-medium leading-4 text-[#1a1a1a] text-ellipsis whitespace-nowrap">
                  {prompt}
                </p>
              </div>
            </div>
            <div className={`flex w-full flex-col items-stretch ${toolbarColor}`}>
              <div
                className="flex items-start justify-center gap-8 px-4 pb-4 pt-1"
                role="toolbar"
                aria-label="Drawing tools"
              >
                <button
                  type="button"
                  className={`flex size-[60px] shrink-0 items-center justify-center rounded-full ${activeToolColor} text-white`}
                  aria-pressed
                  aria-label="Brush"
                >
                  <BrushIcon />
                </button>
                <button
                  type="button"
                  className={`flex size-[60px] shrink-0 items-center justify-center rounded-full ${inactiveToolColor} text-[#4a4a4a]`}
                  aria-label="Matcha mode"
                  aria-pressed={isMatchaMode}
                  onClick={toggleMatchaMode}
                >
                  <FillBucketIcon />
                </button>
                <button
                  type="button"
                  disabled
                  className={`flex size-[60px] shrink-0 items-center justify-center rounded-full ${inactiveToolColor} text-[#4a4a4a] opacity-50`}
                  aria-label="Eraser (coming soon)"
                >
                  <EraserIcon />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
