import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "@/firebaseConfig"
import { doc, setDoc } from "firebase/firestore"
import { UserData } from "@/interfaces/UserData"
import { sendEmailSign } from "@/services/notifications/emailService"

const cpfRegex = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
const phoneRegex = /^\(\d{2}\) \d{4,5}-\d{4}$/

const formSchema = z.object({
  email: z.string()
    .email({ message: "Formato de email inválido" })
    .nonempty({ message: "Email é obrigatório" }),

  name: z.string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .regex(/^[a-zA-Z\s]+$/, { message: "O nome deve conter apenas letras" })
    .nonempty({ message: "Nome é obrigatório" }),

  phone_number: z.string()
    .regex(phoneRegex, { message: "Telefone inválido, o formato correto é (XX) XXXXX-XXXX" })
    .nonempty({ message: "Número de telefone é obrigatório" }),

  password: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula" })
    .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula" })
    .regex(/\d/, { message: "A senha deve conter pelo menos um número" })
    .regex(/\W/, { message: "A senha deve conter pelo menos um caractere especial" })
    .nonempty({ message: "Senha é obrigatória" }),

  confirmPassword: z.string()
    .nonempty({ message: "Confirmação de senha é obrigatória" }),

  cpf: z.string()
    .regex(cpfRegex, { message: "CPF inválido, o formato correto é XXX.XXX.XXX-XX" })
    .nonempty({ message: "CPF é obrigatório" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não correspondem",
  path: ["confirmPassword"],
})

interface DialogProps {
  setIsSignOpen: (open: boolean) => void
}

export default function Register({ setIsSignOpen }: DialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      cpf: ''
    },
  })

  const { reset } = form

  const handleRegister = async (data: UserData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
      const user = userCredential.user
      const userDocRef = doc(db, 'users', user.uid)

      await setDoc(userDocRef, {
        email: data.email,
        name: data.name,
        phone_number: data.phone_number,
        cpf: data.cpf,
        isAdmin: false
      }, { merge: true })
      sendEmailSign(data.email, data.name!, 'registrado')
      setIsSignOpen(false)
      reset()
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        form.setError("email", {
          type: "manual",
          message: "Este email já está registrado.",
        })
      } else {
        console.log("Erro ao criar usuário:", error)
      }
    }
  }

  const formatCPF = (value: any) => {
    const cleaned = ('' + value).replace(/\D/g, '')
    const match = cleaned.match(/(\d{3})(\d{3})(\d{3})(\d{2})/)
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return value
  }

  const formatPhoneNumber = (value: any) => {
    const cleaned = ('' + value).replace(/\D/g, '')
    const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return value
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleRegister)} className="space-y-2 m-5 w-full">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="phone_number"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input {...field}
                    placeholder="Número (00) 00000-0000"
                    value={field.value}
                    onChange={(e) => {
                      const formattedValue = formatPhoneNumber(e.target.value)
                      field.onChange(formattedValue)
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>CPF</FormLabel>
                <FormControl>
                  <Input {...field}
                    placeholder="CPF (000.000.000-00)"
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(formatCPF(e.target.value))
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Senha</FormLabel>
                <FormControl>
                  <Input placeholder="Senha" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Comfirme a senha</FormLabel>
                <FormControl>
                  <Input placeholder="Comfirme a senha" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type='submit' variant='outline' className='w-full'>
          Registrar
        </Button>
      </form>
    </Form>
  )
}