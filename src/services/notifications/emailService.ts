import emailjs from "@emailjs/browser";
import { format, parseISO } from "date-fns";

function sendEmail(email: string, name: string, data: string, scheduling: boolean) {
  const dateStr = data;
  const newDateStr = format(parseISO(dateStr), "dd-MM-yyyy");

  let message;

  if (scheduling) {
    message = `Sua consulta foi agendada com sucesso para o dia ${newDateStr}!`;
  } else {
    message = `Sua consulta para o dia ${newDateStr} foi cancelada!`;
  }
  emailjs
    .send(
      "service_m05byy3",
      "template_z19p2uc",
      {
        to_name: name,
        to_email: email,
        message: message,
      },
      "5k08Z3Ioohmn5Nxyh"
    )
    .then((response) => {
      console.log("Email enviado com sucesso:", response.status, response.text);
    })
    .catch((err) => {
      console.error("Erro ao enviar email:", err);
    });
}

export default sendEmail;
