"use client";

import React, { createContext, useContext, useState } from "react";

type Ctx = { isLoginOpen: boolean; setLoginOpen: (open: boolean) => void };

const LoginOpenContext = createContext<Ctx>({
  isLoginOpen: false,
  setLoginOpen: () => {},
});

export function LoginOpenProvider({ children }: { children: React.ReactNode }) {
  const [isLoginOpen, setLoginOpen] = useState(false);
  return (
    <LoginOpenContext.Provider value={{ isLoginOpen, setLoginOpen }}>
      {children}
    </LoginOpenContext.Provider>
  );
}

export function useLoginOpen() {
  return useContext(LoginOpenContext);
}
