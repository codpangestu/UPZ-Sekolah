import React from 'react';

interface IllustrationProps {
  className?: string;
  size?: number;
}

/**
 * Hero Illustration: Home Page — Digital Platform Mosque
 * Stylized mosque with digital nodes, representing "Platform Digital untuk Masjid"
 */
export function HeroHome({ className, size = 332 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size * 0.64}
      viewBox="0 0 520 332"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dome */}
      <path d="M260 60 C180 60 140 120 130 170 L390 170 C380 120 340 60 260 60Z" fill="#28A71A" opacity="0.15" />
      <path d="M260 70 C190 70 155 125 145 170 L375 170 C365 125 330 70 260 70Z" fill="#28A71A" opacity="0.25" />
      {/* Minaret Left */}
      <rect x="135" y="110" width="14" height="100" rx="3" fill="#28A71A" opacity="0.3" />
      <circle cx="142" cy="108" r="6" fill="#28A71A" opacity="0.4" />
      <path d="M135 108 L142 95 L149 108Z" fill="#28A71A" opacity="0.35" />
      {/* Minaret Right */}
      <rect x="371" y="110" width="14" height="100" rx="3" fill="#28A71A" opacity="0.3" />
      <circle cx="378" cy="108" r="6" fill="#28A71A" opacity="0.4" />
      <path d="M371 108 L378 95 L385 108Z" fill="#28A71A" opacity="0.35" />
      {/* Main Building */}
      <rect x="155" y="160" width="210" height="120" rx="10" fill="#28A71A" opacity="0.12" />
      <rect x="170" y="170" width="180" height="100" rx="8" fill="#28A71A" opacity="0.15" />
      {/* Door */}
      <path d="M240 270 L240 220 Q260 205 280 220 L280 270Z" fill="#28A71A" opacity="0.3" />
      {/* Digital Nodes */}
      <circle cx="100" cy="200" r="4" fill="#28A71A" opacity="0.5" />
      <circle cx="430" cy="180" r="4" fill="#28A71A" opacity="0.5" />
      <circle cx="80" cy="250" r="3" fill="#28A71A" opacity="0.4" />
      <circle cx="450" cy="240" r="3" fill="#28A71A" opacity="0.4" />
      {/* Connection Lines */}
      <line x1="104" y1="200" x2="155" y2="190" stroke="#28A71A" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      <line x1="365" y1="180" x2="426" y2="180" stroke="#28A71A" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.3" />
      <line x1="80" y1="250" x2="155" y2="230" stroke="#28A71A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.25" />
      <line x1="365" y1="220" x2="450" y2="240" stroke="#28A71A" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.25" />
      {/* Ground */}
      <rect x="60" y="280" width="400" height="2" rx="1" fill="#28A71A" opacity="0.15" />
      {/* Star/Sparkle */}
      <path d="M260 50 L262 56 L268 56 L263 60 L265 66 L260 62 L255 66 L257 60 L252 56 L258 56Z" fill="#28A71A" opacity="0.4" />
      <path d="M200 45 L201 49 L205 49 L202 52 L203 56 L200 53 L197 56 L198 52 L195 49 L199 49Z" fill="#28A71A" opacity="0.3" />
      <path d="M320 48 L321 52 L325 52 L322 55 L323 59 L320 56 L317 59 L318 55 L315 52 L319 52Z" fill="#28A71A" opacity="0.3" />
      {/* Crescent Moon */}
      <path d="M400 60 A 20 20 0 1 1 415 80 A 15 15 0 1 0 400 60Z" fill="#28A71A" opacity="0.2" />
    </svg>
  );
}

/**
 * Hero Illustration: Masjid Page — Mosque with Map Pin
 */
export function HeroMasjid({ className, size = 240 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 240 170"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dome */}
      <path d="M120 25 C80 25 60 60 55 90 L185 90 C180 60 160 25 120 25Z" fill="#28A71A" opacity="0.12" />
      <path d="M120 32 C85 32 68 62 63 90 L177 90 C172 62 155 32 120 32Z" fill="#28A71A" opacity="0.2" />
      {/* Minarets */}
      <rect x="55" y="55" width="8" height="55" rx="2" fill="#28A71A" opacity="0.25" />
      <circle cx="59" cy="53" r="4" fill="#28A71A" opacity="0.35" />
      <rect x="177" y="55" width="8" height="55" rx="2" fill="#28A71A" opacity="0.25" />
      <circle cx="181" cy="53" r="4" fill="#28A71A" opacity="0.35" />
      {/* Building */}
      <rect x="65" y="88" width="110" height="60" rx="6" fill="#28A71A" opacity="0.1" />
      {/* Door */}
      <path d="M110 148 L110 118 Q120 108 130 118 L130 148Z" fill="#28A71A" opacity="0.25" />
      {/* Map Pin */}
      <circle cx="200" cy="145" r="15" fill="#28A71A" opacity="0.15" />
      <path d="M200 130 C192 130 186 137 186 145 C186 153 200 163 200 163 C200 163 214 153 214 145 C214 137 208 130 200 130Z" fill="#28A71A" opacity="0.3" />
      <circle cx="200" cy="145" r="5" fill="white" opacity="0.6" />
      {/* Ground */}
      <line x1="40" y1="148" x2="220" y2="148" stroke="#28A71A" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.2" />
    </svg>
  );
}

/**
 * Hero Illustration: Kajian Page — Book/Publikasi
 */
export function HeroKajian({ className, size = 240 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 240 170"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Open Book */}
      <path d="M50 140 L50 50 Q85 35 120 50 L120 140 Q85 125 50 140Z" fill="#28A71A" opacity="0.12" />
      <path d="M120 50 Q155 35 190 50 L190 140 L120 140Z" fill="#28A71A" opacity="0.18" />
      {/* Book spine */}
      <line x1="120" y1="48" x2="120" y2="140" stroke="#28A71A" strokeWidth="2" opacity="0.25" />
      {/* Text lines left */}
      <rect x="60" y="65" width="50" height="3" rx="1.5" fill="#28A71A" opacity="0.3" />
      <rect x="60" y="75" width="45" height="3" rx="1.5" fill="#28A71A" opacity="0.2" />
      <rect x="60" y="85" width="48" height="3" rx="1.5" fill="#28A71A" opacity="0.3" />
      <rect x="60" y="95" width="42" height="3" rx="1.5" fill="#28A71A" opacity="0.2" />
      {/* Text lines right */}
      <rect x="130" y="65" width="50" height="3" rx="1.5" fill="#28A71A" opacity="0.25" />
      <rect x="130" y="75" width="45" height="3" rx="1.5" fill="#28A71A" opacity="0.2" />
      <rect x="130" y="85" width="48" height="3" rx="1.5" fill="#28A71A" opacity="0.25" />
      <rect x="130" y="95" width="40" height="3" rx="1.5" fill="#28A71A" opacity="0.2" />
      {/* Podium/Base */}
      <rect x="35" y="140" width="170" height="4" rx="2" fill="#28A71A" opacity="0.15" />
      {/* Pencil */}
      <path d="M190 50 L200 45 L195 55Z" fill="#28A71A" opacity="0.3" />
      <rect x="198" y="42" width="4" height="14" rx="1" fill="#28A71A" opacity="0.2" transform="rotate(30 200 49)" />
      {/* Star */}
      <path d="M180 35 L181 39 L185 39 L182 42 L183 46 L180 43 L177 46 L178 42 L175 39 L179 39Z" fill="#28A71A" opacity="0.25" />
    </svg>
  );
}

/**
 * Hero Illustration: Donasi Page — Heart with Hands/Donation
 */
export function HeroDonasi({ className, size = 240 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 240 170"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Large Heart */}
      <path d="M120 50 C80 20 50 50 50 80 C50 110 90 140 120 155 C150 140 190 110 190 80 C190 50 160 20 120 50Z" fill="#28A71A" opacity="0.12" />
      <path d="M120 60 C90 35 65 60 65 82 C65 105 95 128 120 140 C145 128 175 105 175 82 C175 60 150 35 120 60Z" fill="#28A71A" opacity="0.18" />
      {/* Inner heart glow */}
      <path d="M120 72 C100 55 82 72 82 87 C82 100 102 115 120 125 C138 115 158 100 158 87 C158 72 140 55 120 72Z" fill="#28A71A" opacity="0.12" />
      {/* Hands */}
      <path d="M40 160 Q50 130 60 155" stroke="#28A71A" strokeWidth="3" strokeLinecap="round" opacity="0.25" fill="none" />
      <path d="M200 160 Q190 130 180 155" stroke="#28A71A" strokeWidth="3" strokeLinecap="round" opacity="0.25" fill="none" />
      <path d="M55 165 Q70 140 80 160" stroke="#28A71A" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" fill="none" />
      <path d="M185 165 Q170 140 160 160" stroke="#28A71A" strokeWidth="2.5" strokeLinecap="round" opacity="0.2" fill="none" />
      {/* Small sparks */}
      <circle cx="135" cy="45" r="2" fill="#28A71A" opacity="0.3" />
      <circle cx="105" cy="42" r="1.5" fill="#28A71A" opacity="0.25" />
      <circle cx="150" cy="50" r="1.5" fill="#28A71A" opacity="0.2" />
      <circle cx="90" cy="48" r="1.5" fill="#28A71A" opacity="0.2" />
    </svg>
  );
}

/**
 * Hero Illustration: Kontak Page — Message/Communication
 */
export function HeroKontak({ className, size = 240 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 240 170"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Message Bubble 1 */}
      <path d="M50 120 Q50 60 120 60 L140 60 Q180 60 180 90 Q180 120 140 120 L110 120 L90 135 L95 120 Q50 120 50 90Z" fill="#28A71A" opacity="0.12" />
      <path d="M58 115 Q58 68 120 68 L138 68 Q172 68 172 92 Q172 115 138 115 L112 115 L96 126 L100 115 Q58 115 58 92Z" fill="#28A71A" opacity="0.1" />
      {/* Message Bubble 2 */}
      <path d="M130 95 Q130 50 180 50 L200 50 Q230 50 230 75 Q230 95 200 95 L175 95 L160 108 L165 95 Q130 95 130 75Z" fill="#28A71A" opacity="0.08" />
      {/* Dots inside bubbles */}
      <circle cx="100" cy="88" r="3" fill="#28A71A" opacity="0.25" />
      <circle cx="120" cy="88" r="3" fill="#28A71A" opacity="0.25" />
      <circle cx="140" cy="88" r="3" fill="#28A71A" opacity="0.25" />
      {/* Envelope icon */}
      <rect x="30" y="30" width="50" height="35" rx="4" fill="#28A71A" opacity="0.15" />
      <path d="M30 33 L55 52 L80 33" stroke="#28A71A" strokeWidth="2" opacity="0.2" fill="none" />
      {/* Phone icon */}
      <path d="M190 140 L195 130 Q198 125 193 120 L188 115 Q183 110 178 113 L175 116 Q175 116 185 130 L190 140Z" fill="#28A71A" opacity="0.15" />
      {/* Location Pin */}
      <circle cx="200" cy="145" r="3" fill="#28A71A" opacity="0.3" />
      <path d="M200 140 L200 150" stroke="#28A71A" strokeWidth="1.5" opacity="0.2" />
    </svg>
  );
}

/**
 * Hero Illustration: Tools Page — Settings/Tools
 */
export function HeroTools({ className, size = 240 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 240 170"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Gear 1 */}
      <circle cx="100" cy="80" r="30" fill="#28A71A" opacity="0.08" />
      <circle cx="100" cy="80" r="20" fill="#28A71A" opacity="0.12" />
      <circle cx="100" cy="80" r="10" fill="#28A71A" opacity="0.2" />
      {/* Gear teeth */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <rect
          key={angle}
          x="96"
          y="47"
          width="8"
          height="12"
          rx="2"
          fill="#28A71A"
          opacity="0.15"
          transform={`rotate(${angle} 100 80)`}
        />
      ))}
      {/* Gear 2 (smaller) */}
      <circle cx="160" cy="100" r="20" fill="#28A71A" opacity="0.08" />
      <circle cx="160" cy="100" r="12" fill="#28A71A" opacity="0.12" />
      <circle cx="160" cy="100" r="6" fill="#28A71A" opacity="0.2" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <rect
          key={angle}
          x="157"
          y="78"
          width="6"
          height="8"
          rx="1.5"
          fill="#28A71A"
          opacity="0.12"
          transform={`rotate(${angle} 160 100)`}
        />
      ))}
      {/* Wrench */}
      <path d="M50 120 L70 100 Q75 95 80 100 L85 105 Q90 110 85 115 L65 135 Q60 140 55 135 L50 130 Q45 125 50 120Z" fill="#28A71A" opacity="0.15" />
      <circle cx="67" cy="117" r="4" fill="#28A71A" opacity="0.2" />
      {/* Small dots */}
      <circle cx="40" cy="55" r="2" fill="#28A71A" opacity="0.2" />
      <circle cx="190" cy="60" r="2" fill="#28A71A" opacity="0.2" />
      <circle cx="50" cy="90" r="1.5" fill="#28A71A" opacity="0.15" />
    </svg>
  );
}

/**
 * Hero Illustration: Tentang/About Page — Info/Shield
 */
export function HeroTentang({ className, size = 240 }: IllustrationProps) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 240 170"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Shield-like shape */}
      <path d="M120 25 L180 55 L180 100 Q180 130 120 150 Q60 130 60 100 L60 55Z" fill="#28A71A" opacity="0.08" />
      <path d="M120 35 L170 60 L170 100 Q170 125 120 142 Q70 125 70 100 L70 60Z" fill="#28A71A" opacity="0.12" />
      {/* Checkmark inside */}
      <path d="M100 90 L115 105 L145 75" stroke="#28A71A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" opacity="0.25" fill="none" />
      {/* Book/Info */}
      <rect x="40" y="45" width="20" height="25" rx="3" fill="#28A71A" opacity="0.1" />
      <rect x="43" y="50" width="14" height="2" rx="1" fill="#28A71A" opacity="0.2" />
      <rect x="43" y="55" width="10" height="2" rx="1" fill="#28A71A" opacity="0.15" />
      {/* People silhouettes */}
      <circle cx="185" cy="75" r="8" fill="#28A71A" opacity="0.12" />
      <path d="M175 100 Q175 90 185 90 Q195 90 195 100" fill="#28A71A" opacity="0.1" />
      <circle cx="205" cy="80" r="6" fill="#28A71A" opacity="0.08" />
      <path d="M197 100 Q197 92 205 92 Q213 92 213 100" fill="#28A71A" opacity="0.07" />
      {/* Sparkles */}
      <path d="M120 18 L121 22 L125 22 L122 25 L123 29 L120 26 L117 29 L118 25 L115 22 L119 22Z" fill="#28A71A" opacity="0.3" />
      <path d="M75 30 L76 33 L79 33 L77 35 L78 38 L75 36 L72 38 L73 35 L71 33 L74 33Z" fill="#28A71A" opacity="0.2" />
      {/* Ground line */}
      <line x1="50" y1="152" x2="190" y2="152" stroke="#28A71A" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.15" />
    </svg>
  );
}

// ============================================================
// INFO CARD ICONS (for HomePage 4 cards)
// ============================================================

interface IconProps {
  className?: string;
  size?: number;
  color?: string;
}

/**
 * Icon: Masjid & Musholla (Building)
 */
export function IconMasjid({ className, size = 24, color = 'white' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 20V13.5L2 14V8L6.5 5.5L10 8V14L8 13.5V20H4ZM13 20V14L11 13.5V7.5L15.5 5L20 7.5V13.5L18 14V20H13ZM15 13V9L14 8.5V13H15ZM18 13V9L17 8.5V13H18Z" fill={color} />
    </svg>
  );
}

/**
 * Icon: UPZ Masjid (Document/Chart)
 */
export function IconUPZ({ className, size = 24, color = 'white' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" stroke={color} strokeWidth="1.5" />
      <path d="M12 14L3 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 14L21 8" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M12 14V22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M8 22H16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Icon: Pengurus Aktif (People)
 */
export function IconPengurus({ className, size = 24, color = 'white' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4.5" stroke={color} strokeWidth="1.5" />
      <path d="M3 22C3 17.0294 7.02944 13 12 13C16.9706 13 21 17.0294 21 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Icon: Donatur (Donors/Hands)
 */
export function IconDonatur({ className, size = 24, color = 'white' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="8" r="4.5" stroke={color} strokeWidth="1.5" />
      <path d="M3 22C3 17.0294 7.02944 13 12 13C16.9706 13 21 17.0294 21 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="8" r="4.5" stroke={color} strokeWidth="1.5" />
      <path d="M1 22C1 17.0294 3.51472 13 7 13" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="16" cy="8" r="4.5" stroke={color} strokeWidth="1.5" />
      <path d="M17 13C20.4853 13 23 17.0294 23 22" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
