"use client";

import { useEffect, useState } from "react";
import { initFirebase } from "@/store/useStore";

export default function ClientOnly({ children }: { children: React.ReactNode }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    initFirebase();
  }, []);

  if (!hasMounted) return null;

  return <>{children}</>;
}
