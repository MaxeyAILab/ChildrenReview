interface Props {
  className?: string
}

/** Luma the Star Sprite — an original character, not based on any existing IP. */
export default function LumaSprite({ className }: Props) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id="luma-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#c4b5fd" />
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <linearGradient id="luma-head" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="100%" stopColor="#d8b4fe" />
        </linearGradient>
      </defs>

      {/* sparkles */}
      <path d="M14 22 L16.5 27 L22 29 L16.5 31 L14 36 L11.5 31 L6 29 L11.5 27 Z" fill="#fde68a" />
      <path d="M86 60 L87.5 63 L90.5 64.5 L87.5 66 L86 69 L84.5 66 L81.5 64.5 L84.5 63 Z" fill="#fde68a" />
      <path d="M80 18 L81 20.5 L83.5 21.5 L81 22.5 L80 25 L79 22.5 L76.5 21.5 L79 20.5 Z" fill="#fbcfe8" />

      {/* body */}
      <path d="M50 46 C68 46 76 62 74 78 C72 92 60 96 50 96 C40 96 28 92 26 78 C24 62 32 46 50 46 Z" fill="url(#luma-body)" />
      <ellipse cx="50" cy="80" rx="16" ry="6" fill="#8b5cf6" opacity="0.35" />

      {/* ears */}
      <path d="M31 30 L23 14 C29 14 36 19 37 27 Z" fill="#d8b4fe" />
      <path d="M69 30 L77 14 C71 14 64 19 63 27 Z" fill="#d8b4fe" />

      {/* head */}
      <circle cx="50" cy="38" r="24" fill="url(#luma-head)" />

      {/* gem */}
      <path d="M50 10 L56 20 L50 26 L44 20 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />

      {/* face */}
      <circle cx="41" cy="39" r="4.2" fill="#3b0764" />
      <circle cx="59" cy="39" r="4.2" fill="#3b0764" />
      <circle cx="39.5" cy="37" r="1.3" fill="#fff" />
      <circle cx="57.5" cy="37" r="1.3" fill="#fff" />
      <path d="M45 48 Q50 52 55 48" stroke="#3b0764" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="32" cy="45" r="3.5" fill="#f9a8d4" opacity="0.7" />
      <circle cx="68" cy="45" r="3.5" fill="#f9a8d4" opacity="0.7" />

      {/* little hands */}
      <circle cx="24" cy="72" r="6" fill="#c4b5fd" />
      <circle cx="76" cy="72" r="6" fill="#c4b5fd" />
    </svg>
  )
}
