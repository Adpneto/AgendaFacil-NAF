import { useState, useEffect } from 'react';
import { ModeToggle } from "@/components/mode-toggle";
import { auth } from "@/firebaseConfig";
import { onAuthStateChanged } from 'firebase/auth';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    })
    return () => unsubscribe()
  }, [])
  if (isAuthenticated === null) {
    return <div>Carregando...</div>
  }

  return (
    <>
      {isAuthenticated ? (
        <>
          <main className="w-full">
            <ModeToggle />
            <div className="w-full flex justify-center">
              <div className="w-[1440px] m-5">
                {children}
              </div>
            </div>
          </main>
        </>
      ) : (
        <>
          <main className="w-full">
            <ModeToggle />
            <div className="w-full flex justify-center">
              <div className="w-full">
                {children}
              </div>
            </div>
          </main>
        </>
      )}
    </>
  )
}