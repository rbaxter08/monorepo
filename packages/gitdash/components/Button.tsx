import clsx from 'clsx';
import React from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const buttonVariantClasses: Record<Variant, string> = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
  secondary: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  tertiary: 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50',
};

const buttonSizeClasses: Record<Size, string> = {
  xs: 'rounded px-2.5 py-1.5 text-xs',
  sm: 'rounded-md px-3 py-2 text-sm leading-4',
  md: 'rounded-md px-4 py-2 text-sm',
  lg: 'rounded-md px-4 py-2 text-base',
  xl: 'rounded-md px-6 py-3 text-base',
};

interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  size?: Size;
  rounded?: boolean;
  variant?: Variant;
}

export function Button({
  size = 'md',
  variant = 'primary',
  rounded = false,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        `font-sans inline-flex items-center border border-transparent font-medium  shadow-sm focus:ring-indigo-500 focus:outline-none focus:ring-2  focus:ring-offset-2`,
        buttonSizeClasses[size],
        buttonVariantClasses[variant],
        rounded && 'rounded-full',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
