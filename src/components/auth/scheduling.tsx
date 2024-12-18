import { useEffect, useState } from 'react'
import { auth, db } from '@/firebaseConfig'
import { doc, setDoc, getDocs, collection, query, where, getDoc, deleteDoc } from 'firebase/firestore'
import { Button } from '../ui/button'
import { UserData } from '@/interfaces/UserData'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import sendEmail from '@/services/notifications/emailService'
import { useToast } from '@/hooks/use-toast'
interface Props {
  isSchedulingOpen: boolean
  setIsSchedulingOpen: (open: boolean) => void
}

function ScheduleAppointment({ isSchedulingOpen, setIsSchedulingOpen }: Props) {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [appointmentId, setAppointmentId] = useState<string | null>(null)
  const [appointmentDetails, setAppointmentDetails] = useState<{ date: string; time: string; userId: string } | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [reservedSlots, setReservedSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const { toast } = useToast()

  const loadUserData = async (userId: string) => {
    const userDocRef = doc(db, 'users', userId)
    const userDocSnap = await getDoc(userDocRef)
    if (userDocSnap.exists()) {
      const userData = userDocSnap.data() as UserData
      setUserData(userData)
    } else {
      console.error('Usuário não encontrado no Firestore.')
    }
  }

  const fetchUserAppointments = async (cpf: string) => {
    const q = query(collection(db, 'appointments'), where('cpf', '==', cpf))
    const querySnapshot = await getDocs(q)
    if (!querySnapshot.empty) {
      const appointment = querySnapshot.docs[0]
      setAppointmentId(appointment.id)
      setAppointmentDetails({
        date: appointment.data().date,
        time: appointment.data().time,
        userId: appointment.data().userId,
      })
    }
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await loadUserData(user.uid)
        if (userData?.cpf) {
          await fetchUserAppointments(userData.cpf)
        }
      } else {
        setUserData(null)
        console.log('Nenhum usuário autenticado.')
      }
    })
    return () => unsubscribe()
  }, [userData])

  const getWeekdays = () => {
    const days = []
    const today = new Date()
    const currentHour = today.getHours()

    if (currentHour >= 17) {
      today.setDate(today.getDate() + 1)
    }

    for (let i = 0; i < 7; i++) {
      const day = new Date(today)
      day.setDate(today.getDate() + i)

      if (day.getDay() === 0 || day.getDay() === 6) continue
      days.push(day.toISOString().split('T')[0])
    }

    return days
  }

  const getDailySlots = (selectedDate: string) => {
    const slots = []
    const today = new Date()
    const isToday = selectedDate === today.toISOString().split('T')[0]
    const startHour = isToday && today.getHours() >= 8 ? Math.max(today.getHours() + 1, 8) : 8

    for (let hour = startHour; hour < 17; hour++) {
      slots.push(`${hour}:00`)
    }

    return slots
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setAvailableSlots(getDailySlots(date))
    fetchReservedSlots(date)
    setSelectedSlot(null)
  }

  const fetchReservedSlots = async (date: string) => {
    const reserved: string[] = []
    const q = query(collection(db, 'appointments'), where('date', '==', date))
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      reserved.push(doc.data().time)
    })
    setReservedSlots(reserved)
  }

  const handleAppointment = async () => {
    if (!selectedDate || !selectedSlot) return

    if (auth.currentUser) {
      const appointmentRef = doc(collection(db, 'appointments'))
      await setDoc(appointmentRef, {
        name: userData?.name,
        email: userData?.email,
        cpf: userData?.cpf,
        date: selectedDate,
        time: selectedSlot,
        userId: auth.currentUser.uid,
        status: 'pendente',
      })
    }
    await toast({
      title: `Agendamento feito com sucesso!`,
      description: `Sua consulta será ${selectedDate} as ${selectedSlot}, chegue com 10 minutos de antecedencia!`
    })
    sendEmail(userData?.email!, userData?.name!, selectedDate, selectedSlot, "sucesso")
    setSelectedDate(null)
    setSelectedSlot(null)
    setIsSchedulingOpen(false)
  }

  const handleCancelAppointment = async () => {
    try {
      if (appointmentId) {
        await deleteDoc(doc(db, 'appointments', appointmentId))
        await toast({
          title: "Agendamento cancelado com sucesso!, já te notificamos por email!"
        })
        if (appointmentDetails) {
          sendEmail(userData?.email!, userData?.name!, appointmentDetails.date, appointmentDetails.time, "cancelado")
        } else {
          console.error('Detalhes do agendamento não disponíveis para envio de e-mail.')
        }
        setAppointmentId(null)
        setAppointmentDetails(null)
      }
    } catch (error) {
      await toast({
        title: "Ocorreu um erro ao cancelar o agendamento. Tente novamente.",
        variant: 'destructive'
      })
    }
  }



  const formatDateForDisplay = (dateString: string) => {
    const [, month, day] = dateString.split('-')
    return `${day}/${month}`
  }

  useEffect(() => {
    if (isSchedulingOpen) {
      const weekdays = getWeekdays()
      const today = new Date()
      const currentHour = today.getHours()
      const firstAvailableDay = weekdays[0]
      handleDateSelect(currentHour >= 17 ? weekdays[1] : firstAvailableDay)
    }
  }, [isSchedulingOpen])

  return (
    <Dialog open={isSchedulingOpen} onOpenChange={setIsSchedulingOpen}>
      {appointmentId && appointmentDetails ? (
        <DialogContent className='flex flex-col'>
          <DialogHeader>
            <DialogTitle>Informações sobre sua consulta</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          <div className='flex flex-col'>
            <p className='font-bold text-lg'>{userData?.name}</p>
            <p>{userData?.cpf}</p>
            <p>{userData?.phone_number}</p>
          </div>
          <div>
            <p>Dia: {formatDateForDisplay(appointmentDetails.date)}</p>
            <p>Horário: {appointmentDetails.time}</p>
          </div>
          <div>
            <p>Local da consulta: </p>
            <p>Av. Alberto Tôrres, 111 - Alto, Teresópolis - RJ, 25964-004</p>
            <p>Prédio Flávio Bortoluzzi, Sala 205</p>
          </div>
          <Button onClick={handleCancelAppointment} variant="destructive" className="mt-4">
            Cancelar Agendamento
          </Button>
        </DialogContent>
      ) : (
        <DialogContent className="h-[430px] flex flex-col justify-between">
          <div>
            <>
              <DialogHeader>
                <DialogTitle>Agendamento</DialogTitle>
                <DialogDescription>Escolha seu horário de atendimento abaixo.</DialogDescription>
              </DialogHeader>
              <h2 className="text-lg font-semibold">Escolha um dia:</h2>
              <div className="flex gap-2 mt-2">
                {getWeekdays().map((day) => (
                  <Button
                    key={day}
                    onClick={() => handleDateSelect(day)}
                    variant={selectedDate === day ? 'default' : 'ghost'}
                  >
                    {formatDateForDisplay(day)}
                  </Button>
                ))}
              </div>
              {selectedDate && (
                <>
                  <h2 className="text-lg font-semibold mt-4">Horários disponíveis</h2>
                  <div className="grid gap-2 mt-2 grid-cols-3">
                    {availableSlots.map((slot) => (
                      <Button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        variant={selectedSlot === slot ? 'default' : 'ghost'}
                        disabled={reservedSlots.includes(slot)}
                      >
                        {slot}
                      </Button>
                    ))}
                  </div>
                </>
              )}
            </>
          </div>
          <DialogFooter>
            <Button onClick={handleAppointment} variant="default" disabled={!selectedSlot}>
              Agendar
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  )
}

export default ScheduleAppointment
