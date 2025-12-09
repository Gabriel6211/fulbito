export default function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-[var(--top-bar)] rounded-lg border-[1px] border-solid border-[var(--border)] shadow-lg shadow-[var(--muted)] ${className}`}>
      {children}
    </div>
  );
}