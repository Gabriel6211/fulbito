export default function CardIcon({ color, icon }: { color: string; icon: React.ReactNode }) {
  return (
    <div
      className="flex flex-row items-center justify-center rounded-lg w-[36px] h-[36px]"
      style={{ backgroundColor: `var(--${color}-light)` }}
    >
      <div style={{ color: `var(--${color})` }}>{icon}</div>
    </div>
  );
}
