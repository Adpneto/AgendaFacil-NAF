import { useEffect, useState } from "react"
import { collection, getDocs, query, where, addDoc, deleteDoc, doc, Timestamp } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { db } from "@/firebaseConfig"
import sendEmail from "@/services/notifications/emailService"
import { useToast } from "@/hooks/use-toast"
import { Appointment } from "@/interfaces/AppointmentData"

export default function AdminAppointments() {
  const [selectedDayAppointments, setSelectedDayAppointments] = useState<Appointment[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<string[]>([])
  const [reservedSlots, setReservedSlots] = useState<string[]>([])
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const { toast } = useToast()

  const [newAppointment, setNewAppointment] = useState({
    name: "",
    email: "",
    cpf: "",
    date: "",
    time: "",
    status: "pendente"
  })

  useEffect(() => {
    deleteExpiredAppointments()
    const weekdays = getWeekdays()
    if (weekdays.length > 0) {
      handleDateSelect(weekdays[0])
    }
  }, [])

  const deleteExpiredAppointments = async () => {
    const today = new Date()
    const formattedToday = today.toISOString().split('T')[0]
    const q = query(collection(db, 'appointments'), where('date', '<', formattedToday))
    const querySnapshot = await getDocs(q)

    querySnapshot.forEach(async (appointment) => {
      await deleteDoc(doc(db, 'appointments', appointment.id))
      console.log(`Horarios expirados, foram apagados do banco de dados.`)
    })

    const currentHour = today.getHours()
    const qToday = query(
      collection(db, 'appointments'),
      where('date', '==', formattedToday)
    )

    const todaySnapshot = await getDocs(qToday)

    todaySnapshot.forEach(async (appointment) => {
      const appointmentTime = parseInt(appointment.data().time.split(':')[0], 10)
      if (appointmentTime < currentHour) {
        await deleteDoc(doc(db, 'appointments', appointment.id))
        console.log(`Horarios expirados,foram apagados do banco de dados.`)
      }
    })
  }

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

  const fetchReservedSlots = async (date: string) => {
    const reserved: string[] = []
    const dayAppointments: Appointment[] = []
    const q = query(
      collection(db, 'appointments'),
      where('date', '==', date)
    )
    const querySnapshot = await getDocs(q)
    querySnapshot.forEach((doc) => {
      reserved.push(doc.data().time)
      dayAppointments.push({ id: doc.id, ...doc.data() } as Appointment)
    })
    setReservedSlots(reserved)
    setSelectedDayAppointments(dayAppointments)
  }

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setAvailableSlots(getDailySlots(date))
    fetchReservedSlots(date)
    setSelectedSlot(null)
  }

  const handleSlotSelect = (slot: string) => {
    const appointment = selectedDayAppointments.find(appt => appt.time === slot)
    if (appointment) {
      setSelectedAppointment(appointment)
      setIsEditing(false) 
    } else {
      setSelectedAppointment(null)
      setNewAppointment({ ...newAppointment, date: selectedDate, time: slot })
      setIsEditing(true) 
    }
    setSelectedSlot(slot)
    setIsDialogOpen(true)
  }

  const handleAddAppointment = async () => {
    if (newAppointment.name && newAppointment.email && newAppointment.cpf && newAppointment.date && newAppointment.time) {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", newAppointment.email)
      )
      const userSnapshot = await getDocs(userQuery)

      let userID: string | null = null
      let notifyEmail = false

      if (!userSnapshot.empty) {
        userID = userSnapshot.docs[0].id
        sendEmail(newAppointment?.email!, newAppointment?.name!, newAppointment!.date, selectedSlot!, "admin")
        await toast({
          title: "Agendamento feito com sucesso!.",
          description: `${newAppointment.name} terá sua consulta as ${newAppointment.time} de ${newAppointment.date}, já foi notificado por email!`
        })
      } else {
        notifyEmail = true
        await toast({
          title: "Agendamento feito com sucesso!.",
          description: `${newAppointment.name} terá sua consulta as ${newAppointment.time} de ${newAppointment.date}, o CPF não estava cadastrado, então enviamos um email com orientações!`
        })
        sendEmail(newAppointment?.email!, newAppointment?.name!, newAppointment!.date, selectedSlot!, "sucessoSemConta")
      }

      await addDoc(collection(db, "appointments"), {
        ...newAppointment,
        userID: userID,
        notifyEmail,
        createdAt: Timestamp.now()
      })
      setIsDialogOpen(false)
    } else {
      alert("Preencha todos os campos obrigatórios!")
    }
  }

  const prepareCancelAppointment = async (appointment: Appointment) => {
    const { email, name, date, time } = appointment
    console.log("Cancelamento de agendamento:", email, name, date, time)
    sendEmail(email, name, date, time, "adminCancelado")
    await handleCancelAppointment(appointment.id);
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    await deleteDoc(doc(db, "appointments", appointmentId))
    fetchReservedSlots(selectedDate)
    setIsDialogOpen(false)
    toast({
      title: "Agendamento cancelado",
      description: "O agendamento foi cancelado e o cliente foi notificado.",
    });
  };


  const formatDateForDisplay = (dateString: string) => {
    const [, month, day] = dateString.split('-')
    return `${day}/${month}`
  }

  const formatCPF = (value: any) => {
    const cleaned = ('' + value).replace(/\D/g, '')
    const match = cleaned.match(/(\d{3})(\d{3})(\d{3})(\d{2})/)
    if (match) {
      return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
    }
    return value
  }

  return (
    <div className="p-5 flex flex-col items-center justify-center h-[747px] w-full">
      <h1 className="text-2xl font-bold mb-4">Administração de Agendamentos</h1>

      <div className="flex flex-col gap-2">
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
                  onClick={() => handleSlotSelect(slot)}
                  variant={reservedSlots.includes(slot) ? 'destructive' : selectedSlot === slot ? 'default' : 'ghost'}
                >
                  {slot}
                </Button>
              ))}
            </div>
          </>
        )}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
            {isEditing ? (
              <h2 className="text-lg font-semibold">Novo Agendamento - {selectedDate}</h2>
            ) : (
              <h2 className="text-lg font-semibold">Agendamentos para {selectedDate}</h2>
            )}
          </DialogHeader>
          {isEditing ? (
            <>
              <Input
                type="text"
                placeholder="Nome do Cliente"
                value={newAppointment.name}
                onChange={(e) => setNewAppointment({ ...newAppointment, name: e.target.value })}
              />
              <Input
                type="email"
                placeholder="E-mail"
                value={newAppointment.email}
                onChange={(e) => setNewAppointment({ ...newAppointment, email: e.target.value })}
              />
              <Input
                type="text"
                placeholder="CPF"
                value={newAppointment.cpf}
                onChange={(e) => setNewAppointment({ ...newAppointment, cpf: formatCPF(e.target.value) })}
              />
              <DialogFooter>
                <Button onClick={handleAddAppointment}>Salvar Agendamento</Button>
              </DialogFooter>
            </>
          ) : (
            selectedAppointment ? (
              <div>
                <p><strong>Cliente:</strong> {selectedAppointment.name}</p>
                <p><strong>E-mail:</strong> {selectedAppointment.email}</p>
                <p><strong>CPF:</strong> {selectedAppointment.cpf}</p>
                <p><strong>Hora:</strong> {selectedAppointment.time}</p>
                <p><strong>Status:</strong> {selectedAppointment.status || "pendente"}</p>
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => selectedAppointment && prepareCancelAppointment(selectedAppointment)}
                  >
                    Cancelar Agendamento
                  </Button>
                </DialogFooter>
              </div>
            ) : (
              <p>Nenhum agendamento encontrado para este horário.</p>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
