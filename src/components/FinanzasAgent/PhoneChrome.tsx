/**
 * Los íconos del marco del teléfono.
 *
 * Son dibujos genéricos —señal, wifi, batería, cámara, teléfono— y no los
 * assets de nadie: la maqueta usa la paleta de una app de mensajería, pero no
 * su logo ni su marca. Todos van dentro de un contenedor `aria-hidden`, así que
 * son decoración pura y no necesitan nombre accesible.
 */

export function Signal() {
  return (
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect y="7.5" width="3" height="3.5" rx="1" />
      <rect x="4.5" y="5" width="3" height="6" rx="1" />
      <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
      <rect x="13.5" width="3" height="11" rx="1" />
    </svg>
  );
}

export function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
      <path d="M8 11.5 5.6 8.8a3.6 3.6 0 0 1 4.8 0L8 11.5Z" />
      <path
        d="M8 5.6c-1.7 0-3.3.6-4.5 1.8L2 5.9A9.2 9.2 0 0 1 8 3.6c2.3 0 4.4.9 6 2.3l-1.5 1.5A6.5 6.5 0 0 0 8 5.6Z"
        opacity=".9"
      />
      <path
        d="M8 .6C5.1.6 2.4 1.7.3 3.6L1.8 5A9.4 9.4 0 0 1 8 2.6c2.4 0 4.6.9 6.2 2.4l1.5-1.4A11.3 11.3 0 0 0 8 .6Z"
        opacity=".55"
      />
    </svg>
  );
}

export function Battery() {
  return (
    <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
      <rect
        x=".6"
        y=".6"
        width="21"
        height="10.8"
        rx="3"
        stroke="currentColor"
        strokeOpacity=".4"
      />
      <rect x="2.2" y="2.2" width="15" height="7.6" rx="1.8" fill="currentColor" />
      <path
        d="M23 4.2v3.6c.9-.3 1.4-.9 1.4-1.8S23.9 4.5 23 4.2Z"
        fill="currentColor"
        fillOpacity=".4"
      />
    </svg>
  );
}

export function Chevron() {
  return (
    <svg width="11" height="18" viewBox="0 0 11 18" fill="none">
      <path
        d="M9.5 1.5 2 9l7.5 7.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Video() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="currentColor">
      <rect y="1" width="13" height="12" rx="3" />
      <path d="M14.5 5.5 20 2v10l-5.5-3.5v-3Z" />
    </svg>
  );
}

export function Call() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="currentColor">
      <path d="M4.3.9a1.4 1.4 0 0 0-1.9.2L1.2 2.5C.3 3.6.5 5.2 1.2 6.7c1.4 3 4.1 5.7 7.1 7.1 1.5.7 3.1.9 4.2 0l1.4-1.2a1.4 1.4 0 0 0 .2-1.9l-1.7-2.2a1.4 1.4 0 0 0-1.8-.4l-1.3.7a11 11 0 0 1-3.1-3.1l.7-1.3a1.4 1.4 0 0 0-.4-1.8L4.3.9Z" />
    </svg>
  );
}

export function Plus() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Mic() {
  return (
    <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
      <rect x="4" width="5" height="9.5" rx="2.5" fill="currentColor" />
      <path
        d="M1.2 7.5v1.2a5.3 5.3 0 0 0 10.6 0V7.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M6.5 14v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
