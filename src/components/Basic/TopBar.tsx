// Components
import ThemeButton from "@/components/Basic/ThemeButton";
import TopBarButton from "@/components/Basic/TopBarButton";
import UserTopbarServer from "@/components/Auth/UserTopbarServer";

// Next imports
import Image from "next/image";
import Link from "next/link";

// Icons
import { TiHome } from "react-icons/ti";

export default function TopBar({ initialTheme }: { initialTheme?: "light" | "dark" }) {
  const buttons = [
    { label: "Home", url: "/", icon: <TiHome size={16} /> },
  ];

  return (
    <header className="top-bar sticky top-0 z-50 backdrop-blur flex flex-row py-3">
      <div className="container flex flex-row justify-between">
        <div className="flex flex-row">
          <Link href="/" className="flex flex-row gap-2 items-center justify-center mr-5 cursor-pointer">
            <Image src="/images/Logo.webp" alt="Tubilletera Logo" width="35" height="33" />
            <h1 className="font-bold text-lg">tubilletera</h1>
          </Link>
          <div className="flex flex-row gap-3">
            {buttons.map(({ label, url, icon: Icon }) => (
              <TopBarButton key={label} label={label} url={url} icon={Icon} />
            ))}
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <ThemeButton initialTheme={initialTheme} />
          <UserTopbarServer />
        </div>
      </div>
    </header>
  );
}
