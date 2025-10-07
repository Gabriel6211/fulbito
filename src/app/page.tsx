import { cookies } from "next/headers";
import ThemeButton from "@/components/ThemeButton";

export default async function Page() {
  const raw = (await cookies()).get("theme")?.value;
  const initialTheme = raw === "dark" || raw === "light" ? (raw as "dark" | "light") : undefined;

  return (
    <main className="p-6">
      <h1 className="text-2xl mb-4">Home</h1>
      <ThemeButton initialTheme={initialTheme} />
    </main>
  );
}
