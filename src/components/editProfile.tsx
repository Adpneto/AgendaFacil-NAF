import { auth, db, storage } from '@/firebaseConfig'
import { UserData } from '@/interfaces/UserData'
import imageCompression from 'browser-image-compression'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { Edit, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface EditProfileProps {
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
}

export default function EditProfile({ isDialogOpen, setIsDialogOpen }: EditProfileProps) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [tempUserData, setTempUserData] = useState<UserData | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUpdating, setIsUpdating] = useState<boolean>(false)
  const navigate = useNavigate()

  const loadUserData = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists()) {
      setUserData(userDocSnap.data() as UserData)
    } else {
      console.error('Usuário não encontrado no Firestore.')
    }
    setIsLoading(false)
  }

  const updateUserData = async (updatedData: Partial<UserData>) => {
    if (auth.currentUser) {
      const userDocRef = doc(db, 'users', auth.currentUser.uid)
      await updateDoc(userDocRef, updatedData)
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await loadUserData(user.uid)
      } else {
        setUserData(null)
        setIsLoading(false)
        console.log('Nenhum usuário autenticado.')
      }
    })
    return () => unsubscribe()
  }, [])


  useEffect(() => {
    if (userData) {
      setTempUserData(userData)
    }
  }, [userData])

  const handleChange = (field: keyof UserData, value: string) => {
    setTempUserData((prev) => {
      if (prev) {
        return {
          ...prev,
          [field]: value,
        }
      }
      return prev
    })
  }

  const handleProfileUpdate = async () => {
    if (!auth.currentUser) {
      console.error('Usuário não está autenticado.')
      return
    }
    setIsUpdating(true)
    try {
      let profilePictureUrl = tempUserData?.profilePicture || undefined

      if (selectedFile) {
        const storageRef = ref(storage, `profilePictures/${auth.currentUser.uid}`)
        await uploadBytes(storageRef, selectedFile)
        profilePictureUrl = `${await getDownloadURL(storageRef)}?timestamp=${Date.now()}`
      }

      if (tempUserData) {
        const updatedUserData = {
          ...tempUserData,
          profilePicture: profilePictureUrl,
        }

        await updateUserData(updatedUserData)
        setTempUserData(updatedUserData)
        setUserData(updatedUserData)
        setIsDialogOpen(false)
        navigate(0)
      }
    } catch (error) {
      console.error('Erro ao atualizar o perfil:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 800 })
        setSelectedFile(compressedFile)

        const imageUrl = URL.createObjectURL(compressedFile)
        setTempUserData((prev) => {
          if (prev) {
            return {
              ...prev,
              profilePicture: imageUrl,
            }
          }
          return prev
        })
      } catch (error) {
        console.error('Erro ao comprimir a imagem:', error)
      }
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {isLoading ? (
        <div>Carregando...</div>
      ) : (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className='hidden'>Edição de Perfil</DialogTitle>
            <DialogDescription className='hidden'>Faça alterações em seu perfil aqui. Clique em salvar quando terminar.</DialogDescription>
          </DialogHeader>
          <DialogContent>
            <div className="gap-4 py-4 flex flex-col justify-center items-center">
              <div className="relative group">
                {tempUserData?.profilePicture ? (
                  <img src={tempUserData.profilePicture} alt="Foto de Perfil" className="rounded-full w-40 h-40 cursor-pointer object-cover" onClick={() => fileInputRef.current?.click()} />
                ) : (
                  <User className="bg-purple-900 p-2 rounded-full w-40 h-40 text-white" onClick={() => fileInputRef.current?.click()} />
                )}
                <Edit className="absolute inset-0 m-auto w-6 h-6 text-white opacity-0 group-hover:opacity-100 cursor-pointer" onClick={() => fileInputRef.current?.click()} />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
              <div className='flex flex-col gap-2'>
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={tempUserData?.name || ''}
                  className="w-full"
                  onChange={(e) => handleChange('name', e.target.value)}
                />
                <div className='flex gap-2'>
                  <div>
                    <Label htmlFor="name">CPF</Label>
                    <Input
                      disabled
                      id="cpf"
                      value={tempUserData?.cpf || ''}
                      className="w-full"
                      onChange={(e) => handleChange('name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="name">Numero de Telefone</Label>
                    <Input
                      id="phone_number"
                      value={tempUserData?.phone_number || ''}
                      className="w-full"
                      onChange={(e) => handleChange('phone_number', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          <DialogFooter className='flex justify-between gap-2'>
            <Button onClick={handleProfileUpdate} disabled={isUpdating}>
              {isUpdating ? "Salvando..." : "Salvar alterações"}
            </Button>
          </DialogFooter>
          </DialogContent>
        </DialogContent>
      )}
    </Dialog>
  )
}