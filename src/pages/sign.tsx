import { useState } from 'react'
import Login from '@/components/auth/login'
import Register from '@/components/auth/register'

export default function Sign() {
	const [showLogin, setShowLogin] = useState(true)
	const toggleForm = () => setShowLogin((prev) => !prev)

	return (
		<div className="relative flex h-screen justify-center items-center overflow-hidden">

			{/* Container para o Login */}
			<div
				className={`absolute inset-0 flex items-center justify-between transform transition-all duration-700 
					${showLogin ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}`}
				style={{ pointerEvents: showLogin ? 'auto' : 'none' }}>
				<div className='bg-login w-full h-screen inset-0 bg-center bg-cover bg-no-repeat hidden md:block' />
				<div className='w-full flex flex-col items-center p-5 z-10'>
					<div className='md:w-[500px] flex flex-col items-center'>
						<h1 className="text-3xl font-bold">Entrar</h1>
						<Login />
						<p className="underline underline-offset-2 cursor-pointer mt-4"
							onClick={toggleForm}>
							Ainda não tem conta? Vamos criar uma então!
						</p>
					</div>
				</div>
			</div>

			{/* Container para o Registro */}
			<div
				className={`absolute inset-0 flex items-center justify-center transform transition-all duration-700 
					${!showLogin ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
				style={{ pointerEvents: !showLogin ? 'auto' : 'none' }}>
				<div className='w-full flex flex-col items-center p-5 z-10'>
					<div className='md:w-[500px] flex flex-col items-center'>
						<h1 className="text-3xl font-bold">Registre-se</h1>
						<Register />
						<p className="underline underline-offset-2 cursor-pointer mt-4"
							onClick={toggleForm}>
							Já tem conta? Vamos logar então!
						</p>
					</div>
				</div>
				<div className='bg-register w-full h-screen inset-0 bg-center bg-cover bg-no-repeat hidden md:block' />
			</div>
		</div>
	)
}
