export default function VialPlaceholder() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#030810',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grid background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(0,184,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,255,0.025) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Ambient radial glow from bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          height: '55%',
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(0,184,255,0.13) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Vial SVG */}
      <svg
        width="76"
        height="128"
        viewBox="0 0 76 128"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'relative', zIndex: 1 }}
      >
        <defs>
          <linearGradient id="vp-glass" x1="0" y1="0" x2="76" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00b8ff" stopOpacity="0.03" />
            <stop offset="22%"  stopColor="#00b8ff" stopOpacity="0.13" />
            <stop offset="78%"  stopColor="#00b8ff" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#00b8ff" stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id="vp-liquid" x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="#00b8ff" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#005faa" stopOpacity="0.85" />
          </linearGradient>

          <radialGradient id="vp-liquid-glow" cx="50%" cy="0%" r="100%">
            <stop offset="0%"   stopColor="#00b8ff" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#00b8ff" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="vp-bottom-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#00b8ff" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00b8ff" stopOpacity="0" />
          </radialGradient>

          <filter id="vp-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <clipPath id="vp-body-clip">
            <rect x="20" y="28" width="36" height="84" rx="7" />
          </clipPath>
        </defs>

        {/* Floor glow */}
        <ellipse cx="38" cy="120" rx="22" ry="5" fill="url(#vp-bottom-glow)" filter="url(#vp-glow)" />

        {/* Rubber stopper cap */}
        <rect x="26" y="13" width="24" height="17" rx="3.5"
          fill="rgba(0,90,165,0.55)"
          stroke="rgba(0,184,255,0.4)"
          strokeWidth="0.6"
        />
        {/* Cap highlight */}
        <rect x="29" y="15" width="4" height="11" rx="1.5" fill="rgba(255,255,255,0.07)" />
        {/* Cap ring */}
        <rect x="26" y="27" width="24" height="3" rx="0"
          fill="rgba(0,184,255,0.18)"
          stroke="rgba(0,184,255,0.28)"
          strokeWidth="0.5"
        />

        {/* Neck taper */}
        <path
          d="M26 30 L20 36 L20 28 L56 28 L56 36 L50 30 Z"
          fill="rgba(0,184,255,0.06)"
          stroke="rgba(0,184,255,0.12)"
          strokeWidth="0.5"
        />

        {/* Vial body */}
        <rect x="20" y="28" width="36" height="84" rx="7"
          fill="url(#vp-glass)"
          stroke="rgba(0,184,255,0.2)"
          strokeWidth="0.8"
        />

        {/* Liquid fill — lower 48% */}
        <g clipPath="url(#vp-body-clip)">
          {/* Liquid body */}
          <rect x="20" y="72" width="36" height="40" fill="url(#vp-liquid)" filter="url(#vp-glow)" />
          {/* Surface meniscus */}
          <ellipse cx="38" cy="72" rx="18" ry="2.5" fill="rgba(0,184,255,0.65)" filter="url(#vp-glow)" />
          {/* Liquid ambient glow */}
          <rect x="20" y="58" width="36" height="54" fill="url(#vp-liquid-glow)" />
          {/* Liquid surface reflection */}
          <rect x="26" y="74" width="10" height="1.5" rx="0.75" fill="rgba(255,255,255,0.18)" />
        </g>

        {/* Label zone (frosted band) */}
        <rect x="26" y="38" width="24" height="26" rx="2.5"
          fill="rgba(0,184,255,0.03)"
          stroke="rgba(0,184,255,0.07)"
          strokeWidth="0.5"
        />
        {/* Label lines */}
        <rect x="29" y="43" width="18" height="1" rx="0.5" fill="rgba(0,184,255,0.12)" />
        <rect x="29" y="47" width="12" height="1" rx="0.5" fill="rgba(0,184,255,0.08)" />
        <rect x="29" y="51" width="15" height="1" rx="0.5" fill="rgba(0,184,255,0.08)" />
        <rect x="29" y="55" width="10" height="1" rx="0.5" fill="rgba(0,184,255,0.06)" />

        {/* Left glass highlight */}
        <rect x="24" y="34" width="2.5" height="68" rx="1.25" fill="rgba(255,255,255,0.055)" />
        {/* Right glass edge */}
        <rect x="50" y="34" width="1.5" height="28" rx="0.75" fill="rgba(255,255,255,0.03)" />
      </svg>
    </div>
  );
}
