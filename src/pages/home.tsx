import ScheduleAppointment from "@/components/auth/scheduling"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function Home() {

  const Servicos = [
    {
      "id": "1",
      "title": "Assistência com Declaração de Imposto de Renda",
      "text": "Isso inclui ajudar indivíduos a preencher e submeter suas declarações de Imposto de Renda, esclarecer dúvidas sobre deduções e orientar sobre obrigações fiscais."
    },
    {
      "id": "2",
      "title": "Orientação para Microempreendedores Individuais (MEIs)",
      "text": "Oferecer suporte para MEIs no que diz respeito à contabilidade, registro de receitas, emissão de notas fiscais e cumprimento das obrigações fiscais."
    },
    {
      "id": "3",
      "title": "Orientação para Pequenas Empresas",
      "text": "Prestar assistência contábil e fiscal a pequenas empresas, incluindo a revisão e organização de registros financeiros."
    },
    {
      "id": "4",
      "title": "Educação Financeira",
      "text": "Realizar workshops e palestras sobre educação financeira para ajudar as pessoas a entenderem melhor suas finanças pessoais e empresariais."
    },
    {
      "id": "5",
      "title": "Assistência com Regularização de Pendências Fiscais",
      "text": "Auxiliar aqueles que têm pendências fiscais a regularizar sua situação perante a Receita Federal, orientando sobre os passos necessários."
    },
    {
      "id": "6",
      "title": "Preparação de Documentos Contábeis Básicos",
      "text": "Ajudar a preparar demonstrativos financeiros básicos, como balanços e demonstrativos de resultado."
    },
    {
      "id": "7",
      "title": "Orientação sobre Benefícios Sociais",
      "text": "Informar sobre benefícios sociais, como o Bolsa Família e programas de assistência social, e ajudar na solicitação desses benefícios."
    },
    {
      "id": "8",
      "title": "Consultoria Fiscal",
      "text": "Prestar consultoria para pessoas físicas e empresas sobre questões fiscais específicas, como planejamento tributário, redução de impostos e regulamentações fiscais."
    },
    {
      "id": "9",
      "title": "Atendimento a Organizações da Sociedade Civil",
      "text": "Oferecer serviços contábeis para organizações sem fins lucrativos, incluindo a preparação de relatórios financeiros."
    },
    {
      "id": "10",
      "title": "Informações sobre Legislação Fiscal",
      "text": "Manter o público informado sobre mudanças na legislação fiscal e como essas mudanças podem afetar suas finanças."
    }
  ]

  const [isSchedulingOpen, setIsSchedulingOpen] = useState<boolean>(false)

  return (
    <div className='flex flex-col items-center m-5'>
      <div className='text-center'>
        <h1 className='text-xl lg:text-4xl font-bold'>Núcleo de Apoio Contábil e Fiscal</h1>
        <h2 className='lg:text-2xl'>Simplificando suas obrigações fiscais com agendamento online fácil.</h2>
        <h3 className='font-light pt-2'>Bem-vindo ao NAF Online, onde tornamos mais simples do que nunca obter ajuda com suas declarações de Imposto de Renda e outros serviços financeiros. Nosso processo de agendamento rápido e conveniente está pronto para atendê-lo. Reserve sua consulta hoje e coloque suas finanças em ordem.</h3>
      </div>

      <div className='flex gap-2 m-5'>
        <img className='w-[33%]' src="img/img1.jpeg" />
        <img className='w-[33%]' src="img/img2.jpg" />
        <img className='w-[33%]' src="img/img3.jpeg" />
      </div>

      <div className='flex flex-col lg:flex-row items-center gap-4 justify-around'>
        <div className="flex flex-col gap-2 items-center lg:w-[35%]">
          <h1 className="font-bold text-2xl text-center">Agende sua Consulta conosco!</h1>
          <h2>Agendar sua consulta conosco é simples e rápido. Escolha o serviço de que você precisa, selecione a data e o horário disponíveis que melhor se adequam à sua agenda e preencha as informações necessárias. Estamos ansiosos para ajudá-lo a resolver suas questões financeiras.</h2>
          <Button className="bg-[#006b64] lg:w-[30%]" onClick={() => setIsSchedulingOpen(true)}>Agendar</Button>
        </div>

        {isSchedulingOpen && (
          <ScheduleAppointment
            isSchedulingOpen={isSchedulingOpen}
            setIsSchedulingOpen={setIsSchedulingOpen}
          />
        )}
        <div className="flex flex-col gap-2 items-center lg:w-[35%]">
          <h1 className="font-bold text-2xl text-center">Fale Conosco</h1>
          <h2>Agendar sua consulta conosco é simples e rápido. Escolha o serviço de que você precisa, selecione a data e o horário disponíveis que melhor se adequam à sua agenda e preencha as informações necessárias. Estamos ansiosos para ajudá-lo a resolver suas questões financeiras.</h2>
          <Button className="bg-[#006b64] lg:w-[30%]">Entrar em contato</Button>
        </div>
      </div>

      <div className='mt-5 grid gap-5 justify-items-center items-center grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-5'>
        {Servicos.map((serv) =>
          <div className='flex flex-col items-center text-center' key={serv.id}>
            <h2 className='text-lg font-bold'>{serv.title}</h2>
            <h3 className='text-left font-light'>{serv.text}</h3>
          </div>)}
      </div>
    </div>
  )
}
