import { useState } from 'react'
import Login from '@/components/auth/login'
import Register from '@/components/auth/register'
import { Dialog } from '@radix-ui/react-dialog'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface Props {
	isSignOpen: boolean
	setIsSignOpen: (open: boolean) => void
}

export default function Sign({ isSignOpen, setIsSignOpen }: Props) {
	const [showLogin, setShowLogin] = useState(true)
	const toggleForm = () => setShowLogin((prev) => !prev)

	return (
		<Dialog open={isSignOpen} onOpenChange={setIsSignOpen}>
			<DialogHeader />
			<DialogTitle />
			<DialogDescription />
			<DialogContent className='h-[500px]'>
				<div className="relative flex justify-center items-center overflow-hidden">
					{/* Container para o Login */}
					<div
						className={`absolute inset-0 flex items-center justify-between transform transition-all duration-700
							${showLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
						style={{ pointerEvents: showLogin ? 'auto' : 'none' }}>
						<div className='w-full flex flex-col items-center z-10'>
							<img src="img/logo.png" alt="Logo da unifeso" className='w-[250px] pb-10' />
							<h1 className="text-3xl font-bold">Entrar</h1>
							<Login />
							<p className="underline underline-offset-2 cursor-pointer"
								onClick={toggleForm}>
								Ainda não tem conta? Vamos criar uma então!
							</p>
						</div>
					</div>
					{/* Container para o Registro */}
					<div
						className={`absolute inset-0 flex items-center justify-center transform transition-all duration-700
							${!showLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
						style={{ pointerEvents: !showLogin ? 'auto' : 'none' }}>
						<div className='w-full flex flex-col items-center z-10'>
							<h1 className="text-3xl font-bold">Registre-se</h1>
							<Register />
							<p className="underline underline-offset-2 cursor-pointer"
								onClick={toggleForm}>
								Já tem conta? Vamos logar então!
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}
