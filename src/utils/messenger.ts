import { config } from 'dotenv';
import { createTransport } from 'nodemailer';

config();

export default function messenger(
  sendee: string,
  title: string,
  message: { html?: string; text?: string },
  senderName?: string,
) {
  console.log('Sent mail => ', {
    auth: {
      user: process.env.NOREPLY_EMAIL,
      pass: process.env.NOREPLY_PASSWORD,
    },
  });

  let transporter = createTransport({
    host: 'mail.peerstake.com',
    port: 465,
    auth: {
      user: process.env.NOREPLY_EMAIL,
      pass: process.env.NOREPLY_PASSWORD,
    },
  });

  let mailOptions = {
    from: `${senderName || 'PeerStake'} <${process.env.NOREPLY_EMAIL}>`,
    to: sendee,
    subject: title,
    text: message.text,
    html: message.html,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        console.log('Error while sending email => ' + err);
        reject('Error while sending email' + err);
      } else {
        console.log('Email sent => ', info);
        resolve(info);
      }
    });
  });
}
