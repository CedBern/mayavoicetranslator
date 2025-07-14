
export function MayaGlyphIcon({ color = '#009688', size = 24, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Icône inspiration maya" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" stroke={color} strokeWidth="2" />
      <circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
      <path d="M8 16L16 8" stroke={color} strokeWidth="2" />
    </svg>
  );
}
