import { Silkscreen } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const pixel = Silkscreen({
  weight: "400",
  subsets: ["latin"],
});

function TextField({
  id,
  defaultValue,
  "aria-label": ariaLabel,
  autoCapitalize,
  autoComplete,
}: {
  id: string;
  defaultValue: string;
  "aria-label": string;
  autoCapitalize?: "characters" | "words" | "sentences" | "none";
  autoComplete?: string;
}) {
  return (
    <div className="relative flex h-14 w-full items-center px-0">
      <div className="pointer-events-none absolute inset-0 rounded-md bg-white" />
      <input
        id={id}
        name={id}
        type="text"
        defaultValue={defaultValue}
        aria-label={ariaLabel}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        className="relative z-10 min-w-0 flex-1 bg-transparent text-center font-sans text-[17px] font-medium leading-4 text-[#1a1a1a] outline-none placeholder:text-[#1a1a1a]/40"
      />
    </div>
  );
}

export function EntryScreen() {
  return (
    <div
      className="relative h-dvh min-h-dvh w-full overflow-hidden bg-white font-sans"
      data-node-id="2261:1306"
    >
      {/* Collage background */}
      <div className="pointer-events-none absolute inset-0 min-h-dvh w-full overflow-hidden">
        <div className="absolute inset-0 bg-white" />
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute -left-[16.45%] -top-[25.05%] h-[125.05%] w-[166.2%]">
            <Image
              alt=""
              src="/assets/collage-bg.png"
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          </div>
        </div>

        <div className="absolute left-[321px] top-[230px] flex h-[71.716px] w-[78.201px] items-center justify-center">
          <div className="-rotate-[7.51deg]">
            <div className="relative h-[63.034px] w-[70.568px]">
              <Image
                src="/assets/flower.png"
                alt=""
                width={71}
                height={63}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        <div className="absolute left-[294px] top-[58px] flex h-[81.059px] w-[65px] items-center justify-center">
          <Image
            src="/assets/star-pink.svg"
            alt=""
            width={60}
            height={75}
            className="max-h-full w-auto object-contain"
            unoptimized
          />
        </div>
        <div className="absolute left-[359px] top-[102px] flex h-[50.059px] w-[40.142px] items-center justify-center">
          <Image
            src="/assets/star-yellow.svg"
            alt=""
            width={36}
            height={45}
            className="max-h-full w-auto object-contain"
            unoptimized
          />
        </div>
        <div className="absolute left-0 top-[216px] flex h-[50.059px] w-[40.142px] items-center justify-center">
          <Image
            src="/assets/star-green.svg"
            alt=""
            width={36}
            height={45}
            className="max-h-full w-auto object-contain"
            unoptimized
          />
        </div>
      </div>

      {/* Form */}
      <div className="absolute left-0 right-0 top-[120px] w-full px-4 sm:px-5">
        <div className="mx-auto flex w-full max-w-[390px] flex-col gap-8">
          <div className="flex w-full flex-col gap-2.5">
            <label
              htmlFor="team-code"
              className={`h-4 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[24px] leading-4 text-[#1a1a1a] ${pixel.className}`}
            >
              TEAM CODE
            </label>
            <TextField
              id="team-code"
              defaultValue="A3B5Q9"
              aria-label="Team code"
              autoCapitalize="characters"
              autoComplete="off"
            />
          </div>
          <div className="flex w-full flex-col items-center gap-[9px]">
            <label
              htmlFor="your-name"
              className={`h-4 w-full overflow-hidden text-ellipsis whitespace-nowrap text-center text-[24px] leading-4 text-[#1a1a1a] ${pixel.className}`}
            >
              YOUR NAME
            </label>
            <TextField
              id="your-name"
              defaultValue="Jake"
              aria-label="Your name"
              autoCapitalize="words"
              autoComplete="name"
            />
          </div>
          <div className="relative grid w-full grid-rows-[max-content] place-items-start leading-none">
            <Link
              href="/guess"
              className={`col-start-1 row-start-1 flex h-[62px] w-full items-center justify-center bg-[#b48f66] text-center text-[24px] leading-[22px] tracking-[-0.43px] text-white ${pixel.className}`}
            >
              START →
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation title only */}
      <div className="absolute left-0 top-0 z-10 w-full px-4 pt-[max(12px,env(safe-area-inset-top,0px))] sm:px-5">
        <div
          className="pointer-events-none absolute left-0 right-0 top-0 h-24 overflow-hidden"
          aria-hidden
        >
          <div className="absolute inset-0 backdrop-blur-[25px]" />
        </div>
        <div className="relative flex h-11 w-full shrink-0 items-center justify-center">
          <h1
            className={`text-center text-[24px] leading-[22px] tracking-[-0.43px] text-black ${pixel.className}`}
          >
            LATTE PICTIONARY
          </h1>
        </div>
      </div>
    </div>
  );
}
