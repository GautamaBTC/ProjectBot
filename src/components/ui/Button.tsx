import { type ReactNode, type AnchorHTMLAttributes, type ButtonHTMLAttributes } from 'react';

type Variant = 'gold' | 'white';
type Size = 'sm' | 'md' | 'lg';

interface BaseProps {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

type LinkProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
type BtnProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type Props = LinkProps | BtnProps;

const sizeClasses: Record<Size, string> = {
  sm: 'px-5 py-2.5 text-[0.7rem]',
  md: 'px-8 py-3.5 text-[0.75rem]',
  lg: 'px-10 py-4 text-[0.8rem]',
};

export default function Button(props: Props) {
  const { variant = 'gold', size = 'md', children, ...rest } = props;
  const classes = `hero-btn-glass hero-btn-${variant} ${sizeClasses[size]} ${props.className || ''}`;

  if ('href' in rest && rest.href) {
    const { href, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const btnRest = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={classes} {...btnRest}>
      {children}
    </button>
  );
}
