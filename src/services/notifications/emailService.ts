import emailjs from "@emailjs/browser";
import { format, parseISO } from "date-fns";

function sendEmail(email: string, name: string, data: string, time: string, scheduling: string) {
  const dateStr = data;
  const newDateStr = format(parseISO(dateStr), "dd-MM-yyyy");

  let message;

  if (scheduling == "sucesso") {
    message = 
      `Prezado(a) ${name},

      Estamos felizes em informar que a sua consulta foi agendada com sucesso!

      Detalhes da Consulta:

      Data: ${newDateStr}
      Hora: ${time}
      Local: Av. Alberto Tôrres, 111 - Alto, Teresópolis - RJ, 25964-004
            Prédio Flávio Bortoluzzi, Sala 205
            
      Pedimos que chegue com 10 minutos de antecedência para garantir um atendimento mais ágil. Se precisar cancelar ou remarcar a sua consulta, por favor, entre em contato conosco com pelo menos 24 horas de antecedência.

      Agradecemos por escolher NAF - Unifeso. Se tiver alguma dúvida ou precisar de mais informações, não hesite em nos contatar.`;
  } else if (scheduling == "admin") {
    message =
      `Prezado(a) ${name},

      Estamos felizes em informar que a sua consulta foi agendada com sucesso!

      Detalhes da Consulta:

      Data: ${newDateStr}
      Hora: ${time}
      Local: Av. Alberto Tôrres, 111 - Alto, Teresópolis - RJ, 25964-004
             Prédio Flávio Bortoluzzi, Sala 205

      Pedimos que chegue com 10 minutos de antecedência para garantir um atendimento mais ágil. Se precisar cancelar ou remarcar a sua consulta, por favor, entre em contato conosco com pelo menos 24 horas de antecedência.

      Agradecemos por escolher NAF - Unifeso. Se tiver alguma dúvida ou precisar de mais informações, não hesite em nos contatar.`;
  } else if (scheduling == "adminCancelado") {
    message =
      `Prezado(a) ${name},

      Esperamos que esta mensagem o encontre bem.

      Gostaríamos de informar que a sua consulta agendada para o dia ${newDateStr} às ${time} foi cancelada. Pedimos desculpas por qualquer inconveniente que isso possa causar.

      Se você desejar remarcar sua consulta ou se precisar de mais informações, não hesite em nos contatar. Estamos aqui para ajudar!

      Agradecemos pela sua compreensão e esperamos vê-lo em breve.

      Atenciosamente, NAF - Unifeso!`;
  } else if (scheduling == "cancelado") {
    message = 
     `Prezado(a) ${name},

      Registramos que a sua consulta agendada para o dia ${newDateStr} às ${time} foi cancelada. 

      Se você desejar remarcar sua consulta ou se precisar de mais informações, não hesite em nos contatar. Estamos aqui para ajudar!

      Agradecemos pela sua compreensão e esperamos vê-lo em breve.

      Atenciosamente, NAF - Unifeso!`;
  } else if (scheduling == "sucessoSemConta") {
    message = 
     `Prezado(a) ${name},

      Temos o prazer de informar que uma consulta foi agendada para você por um de nossos funcionários!

      Detalhes da Consulta:

      Data: ${newDateStr}
      Hora: ${time}
      Local: Av. Alberto Tôrres, 111 - Alto, Teresópolis - RJ, 25964-004
             Prédio Flávio Bortoluzzi, Sala 205

      Para acessar todas as informações da sua consulta, bem como a opção de cancelar ou reagendar, você precisará criar uma conta em nosso site. É fácil e rápido! Basta utilizar o seu CPF informado para se registrar.

      Como Criar Sua Conta:

      Acesse nosso site: https://agendafacil-naf.vercel.app/
      Clique em "Entrar".
      Insira o seu CPF e siga as instruções na tela para completar o cadastro.
      Após criar sua conta, você poderá gerenciar suas consultas de forma prática e conveniente.

      Se tiver alguma dúvida ou precisar de assistência durante o processo de criação da conta, não hesite em nos contatar.

      Agradecemos por escolher NAF - Unifeso. Estamos à disposição para ajudar!

      Atenciosamente, NAF - Unifeso!`;
  } else if (scheduling == "registrado") {
    message = 
     `Olá, ${name}!

      Estamos felizes em informar que seu registro foi concluído com sucesso! Agora, você pode acessar nossa plataforma para agendar suas consultas de forma rápida e prática.

      Para começar, basta fazer login e visitar a seção de Agendamentos em nosso site. Lá, você poderá escolher as datas e horários disponíveis conforme sua conveniência.

      Se tiver qualquer dúvida ou precisar de assistência, estamos à disposição para ajudar.

      Seja bem-vindo e aproveite a praticidade da nossa plataforma!

      Atenciosamente, NAF - Unifeso!`;
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

 export function sendEmailSign(email: string, name: string, action: string) {
  let message;

  if (action == "registrado") {
    message = 
      `Olá, ${name}!

      Estamos felizes em informar que seu registro foi concluído com sucesso! Agora, você pode acessar nossa plataforma para agendar suas consultas de forma rápida e prática.

      Para começar, basta fazer login e visitar a seção de Agendamentos em nosso site. Lá, você poderá escolher as datas e horários disponíveis conforme sua conveniência.

      Se tiver qualquer dúvida ou precisar de assistência, estamos à disposição para ajudar.

      Seja bem-vindo e aproveite a praticidade da nossa plataforma!

      Atenciosamente, NAF - Unifeso!`
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

export default sendEmail
