import React, { ButtonHTMLAttributes, ReactNode } from "react";
import Link, { LinkProps } from "next/link";
import classNames from "classnames";

interface BaseButtonProps {
  variant: "primary" | "secondary";
  isSelected?: boolean;
  children: ReactNode;
  className?: string;
  type?: "submit" | "button";
  loading?: boolean;
}

export type ButtonProps = BaseButtonProps &
  (({ href?: never } & ButtonHTMLAttributes<HTMLButtonElement>) | ({ href: string } & LinkProps));

const Button: React.FC<ButtonProps> = ({
  variant,
  isSelected = false,
  children,
  className,
  loading = false,
  type = "button",
  ...rest // Collects all other props (onClick, href, type, disabled, etc.)
}) => {
  const baseStyles =
    "rounded-lg font-semibold cursor-pointer text-sm flex flex-row items-center justify-center";
  const isLink = "href" in rest;

  const variantStylesButton = {
    primary: classNames(
      "bg-[var(--primary)] text-[var(--bg)] hover:bg-[var(--primary-hover)]",
      isSelected && ""
    ),
    secondary: classNames(
      "bg-[var(--input)] border-[1px] border-solid border-[var(--border)] text-[var(--text)] hover:bg-[var(--secondary)]",
      isSelected && ""
    ),
  };

  const variantStylesLink = {
    primary: classNames(
      !isSelected && "text-[var(--bg)]  hover:bg-[var(--primary-hover)]",
      isSelected && ""
    ),
    secondary: classNames(
      !isSelected && "text-[var(--text)] hover:bg-[var(--secondary)]",
      isSelected && "bg-[var(--primary)] text-[var(--bg)]"
    ),
  };

  const combinedClasses = classNames(
    baseStyles,
    isLink ? variantStylesLink[variant] : variantStylesButton[variant],
    className // Allows custom class overrides
  );

  if (isLink) {
    const linkProps = rest as LinkProps & { className?: string };

    return (
      <Link className={combinedClasses} {...linkProps}>
        {children}
      </Link>
    );
  }

  // If href does not exist, render a standard HTML button.
  const buttonProps = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button className={combinedClasses} {...buttonProps} type={type}>
      {loading ? (
        <div className="w-4 h-4 border-2 border-gray-300 border-t-[var(--primary)] rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
