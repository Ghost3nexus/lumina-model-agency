import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size = 'sm' | 'md' | 'lg';

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  arrow?: boolean;
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[#FAFAFA] text-[#050508] hover:bg-[#00D4FF] hover:text-[#050508]',
  secondary:
    'border border-[#FAFAFA]/60 text-[#FAFAFA] hover:border-[#00D4FF] hover:text-[#00D4FF]',
  ghost:
    'text-[#FAFAFA]/80 hover:text-[#00D4FF]',
};

const sizeClass: Record<Size, string> = {
  sm: 'text-[11px] tracking-[0.12em] px-4 py-2',
  md: 'text-xs tracking-[0.14em] px-5 py-2.5',
  lg: 'text-xs tracking-[0.16em] px-7 py-3.5',
};

export default function CTAButton({
  variant = 'primary',
  size = 'md',
  children,
  arrow = false,
  className = '',
  ...rest
}: CTAButtonProps) {
  return (
    <button
      className={[
        'inline-flex items-center gap-2 uppercase font-medium rounded-full',
        'transition-colors duration-200 ease-out',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(' ')}
      {...rest}
    >
      <span>{children}</span>
      {arrow && <span aria-hidden>→</span>}
    </button>
  );
}
