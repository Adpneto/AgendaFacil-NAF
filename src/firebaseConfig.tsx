import { initializeApp } from "firebase/app"
import { getAuth, User } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { setPersistence, browserLocalPersistence } from "firebase/auth"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDbQ7wEBzxTfbhjhedlAA9I7H1r0wiIehw",
  authDomain: "databasetests-73bec.firebaseapp.com",
  projectId: "databasetests-73bec",
  storageBucket: "databasetests-73bec.appspot.com",
  messagingSenderId: "948921071839",
  appId: "1:948921071839:web:1a36cfbd3b6c05ff6b916a"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export interface AuthContextType {
  currentUser: User | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          setCurrentUser(user)
        });
        return () => unsubscribe()
      })
      .catch((error) => {
        console.error("Erro ao configurar a persistência:", error)
      })
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  )
}