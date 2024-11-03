import { FacebookIcon, InstagramIcon, YoutubeIcon } from 'lucide-react'
import { Button } from './ui/button'

export default function Footer() {
  return (
    <div className='w-full flex flex-col gap-4 items-center justify-center h-[150px] bg-[#292828] border-t-4 border-[#006b64]'>
      <img className='w-[250px]' src="img/logo.png" alt="Logo da unifeso" />
      <div className='flex gap-1 justify-center items-center'>
        <Button size={'icon'} className='rounded-full border border-[#BEBEBE] bg-transparent '>
          <InstagramIcon size="30px" className='text-white' />
        </Button>
        <Button size={'icon'} className='rounded-full border border-[#BEBEBE] bg-transparent '>
          <FacebookIcon size="30px" className='text-white' />
        </Button>
        <Button size={'icon'} className='rounded-full border border-[#BEBEBE] bg-transparent '>
          <YoutubeIcon className='text-[#BEBEBE]' />
        </Button>
      </div>
    </div>
  )
}
