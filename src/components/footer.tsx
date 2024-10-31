import { FacebookIcon, InstagramIcon, YoutubeIcon } from 'lucide-react'
import { Button } from './ui/button'

export default function Footer() {
  return (
    <div className='w-full flex flex-col gap-4 items-center justify-center h-[150px] bg-[#292828] border-t-4 border-[#006b64]'>
      <img className='w-[250px]' src="img/logo.png" alt="Logo da unifeso" />
      <div className='flex gap-1 justify-center items-center'>
        <Button variant={'ghost'} className='rounded-full'>
          <InstagramIcon size="30px" className='text-white' />
        </Button>
        <Button variant={'ghost'} className='rounded-full'>
          <FacebookIcon size="30px" className='text-white' />
        </Button>
        <Button variant={'ghost'} className='rounded-full'>
          <YoutubeIcon size="30px" className='text-white' />
        </Button>
      </div>
    </div>
  )
}
