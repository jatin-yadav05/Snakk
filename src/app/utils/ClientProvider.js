'use client';

import { SessionProvider } from "next-auth/react";

export function ClientProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
