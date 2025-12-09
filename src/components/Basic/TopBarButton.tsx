"use client";

import Button from "@/components/Basic/Button";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function TopBarButton({
  label,
  url,
  icon,
}: {
  label: string;
  url: string;
  icon: ReactNode;
}) {
  const pathname = usePathname();

  return (
    <Button
      key={label}
      variant="secondary"
      href={url}
      isSelected={pathname === url}
      className="px-3 gap-1"
    >
      {icon}
      {label}
    </Button>
  );
}
