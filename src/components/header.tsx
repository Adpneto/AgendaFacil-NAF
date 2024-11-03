import { auth, db } from '@/firebaseConfig'
import { Avatar } from '@radix-ui/react-avatar'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AvatarFallback, AvatarImage } from './ui/avatar'
import EditProfile from './editProfile'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { Button } from './ui/button'
import { BadgeCheck, Bell, Calendar, LogOut, User } from 'lucide-react'
import Sign from '@/components/auth/sign'
import ScheduleAppointment from './auth/scheduling'

export default function Header() {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [isSignOpen, setIsSignOpen] = useState<boolean>(false)
  const [isSchedulingOpen, setIsSchedulingOpen] = useState<boolean>(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid)
        const userDoc = await getDoc(userDocRef)
        if (userDoc.exists()) {
          setUser({
            username: userDoc.data().username,
            email: user.email,
            name: userDoc.data().name,
            surname: userDoc.data().surname,
            profilePicture: userDoc.data().profilePicture || null,
          })
        }
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  function logOut() {
    auth.signOut()
    navigate('/')
  }

  return (
    <div className='bg-[#006b64] w-full p-2 flex items-center justify-around'>
      <img className='w-[150px]' src="img/logo.png" alt="" />
      <div>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size={'icon'} variant={'ghost'} className='rounded-full'>
                <Avatar className="h-10 w-10 rounded-full">
                  {user.profilePicture ? (
                    <AvatarImage className='rounded-full' src={user.profilePicture} alt={user.name} />
                  ) : (
                    <AvatarFallback className="rounded-full w-10 h-10"><User /></AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-10 w-10 rounded-full">
                    {user.profilePicture ? (
                      <AvatarImage className='rounded-lg' src={user.profilePicture} alt={user.name} />
                    ) : (
                      <AvatarFallback className="rounded-full"><User /></AvatarFallback>
                    )}
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name} {user.surname}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                  <BadgeCheck />
                  Editar Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsSchedulingOpen(true)}>
                  <Calendar />
                  Agendamentos
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell />
                  Notificações
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logOut}>
                <LogOut />
                Sair da conta
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button className='bg-gray-600 border-none' onClick={() => setIsSignOpen(true)} variant={'outline'}>Entrar</Button>
        )}

        {/* Renderiza apenas se o Dialog correspondente estiver aberto */}
        {isSignOpen && (
          <Sign
            isSignOpen={isSignOpen}
            setIsSignOpen={setIsSignOpen}
          />
        )}
        {isSchedulingOpen && (
          <ScheduleAppointment
            isSchedulingOpen={isSchedulingOpen}
            setIsSchedulingOpen={setIsSchedulingOpen}
          />
        )}
        {isDialogOpen && (
          <EditProfile
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />
        )}
      </div>
    </div>
  )
}
