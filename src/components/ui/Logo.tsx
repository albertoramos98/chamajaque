import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

export function LogoIcon({ size = 32, className, ...props }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Background soft circle (optional, matches the premium clean feel) */}
      <circle cx="24" cy="24" r="22" className="fill-primary/10" />

      {/* Styled Broom (Vassoura) - behind the spray bottle */}
      <g transform="rotate(-15 24 24)">
        {/* Handle (Cabo) */}
        <rect
          x="14"
          y="6"
          width="2"
          height="22"
          rx="1"
          className="fill-slate-400 group-hover:fill-slate-500 transition-colors"
        />
        {/* Brush Connector */}
        <path
          d="M12 28H18L17 31H13L12 28Z"
          className="fill-slate-600"
        />
        {/* Straw/Bristles (Cerdas) */}
        <path
          d="M11 31C11 31 10 38 12 39C14 40 16 40 18 39C20 38 19 31 19 31H11Z"
          className="fill-amber-500/80 group-hover:fill-amber-500 transition-colors"
        />
        {/* Bristle details */}
        <line x1="13" y1="32" x2="13" y2="38" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
        <line x1="15" y1="32" x2="15" y2="39" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
        <line x1="17" y1="32" x2="17" y2="38" stroke="white" strokeWidth="0.5" strokeLinecap="round" />
      </g>

      {/* Spray Bottle (Borrifador) - in front */}
      <g transform="translate(4, 2)">
        {/* Bottle Body (Liquid container) */}
        <path
          d="M16 22C16 19 18 17 21 17H23C26 17 28 19 28 22V36C28 39 26 41 23 41H21C18 41 16 39 16 36V22Z"
          className="fill-primary group-hover:opacity-95 transition-opacity"
        />
        {/* Liquid level effect inside */}
        <path
          d="M16 30C16 30 19 29 22 30C25 31 28 30 28 30V36C28 39 26 41 23 41H21C18 41 16 39 16 36V30Z"
          className="fill-primary-foreground/20"
        />
        {/* Bottle Neck */}
        <path
          d="M20 17H24V12H20V17Z"
          className="fill-slate-700"
        />
        {/* Spray Head / Trigger */}
        <path
          d="M18 10C18 8 20 7 24 7C25.5 7 26 8 26 9.5C26 10.5 25 11 25 12H19C19 12 18 11.5 18 10Z"
          className="fill-slate-800"
        />
        <path
          d="M25 9.5L28 10.5L27 11.5L25 11"
          className="fill-slate-800"
        />
        {/* Trigger lever */}
        <path
          d="M20 12.5L18 15.5L19 16.5L21 13"
          className="fill-slate-600"
        />
      </g>

      {/* Sparkles / Clean Shine (Brilhos de Limpeza) */}
      {/* Sparkle 1 */}
      <path
        d="M38 12C38 10.5 39.5 9 41 9C39.5 9 38 7.5 38 6C38 7.5 36.5 9 35 9C36.5 9 38 10.5 38 12Z"
        className="fill-amber-400 animate-pulse"
      />
      {/* Sparkle 2 */}
      <path
        d="M9 16C9 15 10 14 11 14C10 14 9 13 9 12C9 13 8 14 7 14C8 14 9 15 9 16Z"
        className="fill-amber-400"
      />
      {/* Sparkle 3 */}
      <path
        d="M34 32C34 31.2 34.8 30.4 35.6 30.4C34.8 30.4 34 29.6 34 28.8C34 29.6 33.2 30.4 32.4 30.4C33.2 30.4 34 31.2 34 32Z"
        className="fill-primary"
      />
    </svg>
  );
}

export default function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <LogoIcon size={size} className="shrink-0 transition-transform group-hover:scale-105" />
      <span className="text-xl font-bold tracking-tight text-slate-900">
        Chama<span className="text-primary font-extrabold">Jaque</span>
      </span>
    </div>
  );
}
