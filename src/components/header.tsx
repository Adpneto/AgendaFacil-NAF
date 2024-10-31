import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <div className='bg-[#006b64] w-full p-2 flex justify-around'>
        <img className='w-[150px]' src="img/logo.png" alt="" />
        <div className='font-semibold flex gap-2 items-center justify-center'>
            <Link to=''>Inicio</Link>
            <Link to=''>Perfil</Link>
            <Link to=''>Sobre</Link>
            <Link to=''>Contato</Link>
        </div>
    </div>
  )
}
