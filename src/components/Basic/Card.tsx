interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className }: CardProps) {
  return (
    <div className={`bg-[var(--top-bar)] rounded-lg border-[1px] border-solid border-[var(--border)] shadow-lg shadow-[var(--muted)] ${className}`}>
      {children}
    </div>
  );
}