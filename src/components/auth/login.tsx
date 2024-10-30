import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { auth } from '../../firebaseConfig'
import { useNavigate } from 'react-router-dom'

const formSchema = z.object({
  email: z.string()
    .email({ message: "Formato de email inválido" })
    .nonempty({ message: "Email é obrigatório" }),
  password: z.string()
    .nonempty({ message: "Senha é obrigatória" }),
})

export default function Login() {
  const navigate = useNavigate()
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const handleLogin = async (data: { email: string; password: string }) => {
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password)
      navigate('/home')
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        form.setError("password", {
          type: "manual",
          message: "Email ou senha invalidos!.",
        })
      } else {
        console.error("Erro desconhecido:", error)
        alert("Erro desconhecido. Tente novamente.")
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-2 m-5 w-full">
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input type='text' placeholder='Email' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}>
        </FormField>
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='w-full'>
              <FormControl>
                <Input type='password' placeholder='Senha' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}>
        </FormField>
        <Button type='submit' variant='outline' className='w-full'>
          Entrar
        </Button>
      </form>
    </Form>
  )
}