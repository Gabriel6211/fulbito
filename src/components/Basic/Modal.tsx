import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { IoClose } from "react-icons/io5";

export default function Modal({
  children,
  isOpen,
  onClose,
}: Readonly<{ children: React.ReactNode; isOpen: boolean; onClose: () => void }>) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!isOpen || !mounted) {
    return null;
  }

  let modalRoot = document.getElementById("modal-root");
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.setAttribute("id", "modal-root");
    document.body.appendChild(modalRoot);
  }

  return createPortal(
    <div
      className="h-screen w-screen fixed left-0 bottom-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div className="relative rounded-lg bg-[var(--bg)] p-5" onClick={(e) => e.stopPropagation()}>
        <button
          className="absolute top-2 right-2 cursor"
          onClick={onClose}
        >
          <IoClose />
        </button>
        {children}
      </div>
    </div>,
    modalRoot
  );
}
