export interface Point {
  x: number;
  y: number;
}

export interface Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  opacity: number;
  color: string;
  glow: number;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  description: string;
  price: string;
  previewSrc?: string;
}

export interface Review {
  id: string;
  text: string;
  name: string;
  service: string;
}

export interface Price {
  id: string;
  name: string;
  price: string;
}

export interface BookingFormValues {
  name: string;
  phone: string;
  service: string;
}

export interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost';
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}
