import { ModeToggle } from "@/components/mode-toggle"
import Footer from '@/components/footer'
import Header from '@/components/header'

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <main className="flex flex-col items-center">
      <ModeToggle />
      <Header />
      <div className="2xl:w-[1440px]">
        {children}
      </div>
      <Footer />
    </main>
  )
}