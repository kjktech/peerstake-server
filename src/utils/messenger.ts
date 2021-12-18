import { config } from 'dotenv';
import { createTransport } from 'nodemailer';

config();

const { MESSENGER_EMAIL, MESSENGER_PASSWORD } = process.env;

export default function messenger(
  sendee: string | string[],
  title: string,
  message: { html?: string; text?: string },
  senderName?: string,
) {
  var transporter = createTransport({
    service: 'gmail',
    secure: false,
    port: 587,
    requireTLS: true,
    auth: {
      user: MESSENGER_EMAIL,
      pass: MESSENGER_PASSWORD,
    },
  });

  var mailOptions = {
    from: `${senderName || 'PeerStake'} <russell@kjk.africa>`,
    to: sendee.constructor === Array ? sendee.map((e) => `${e}, `) : sendee,
    subject: title,
    text: message.text,
    html: message.html,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (e) {
    console.log(e);
  }

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

  // console.log('Sent mail => ', {
  //   auth: {
  //     user: process.env.NOREPLY_EMAIL,
  //     pass: process.env.NOREPLY_PASSWORD,
  //   },
  // });

  // let transporter = createTransport({
  //   host: 'mail.peerstake.com',
  //   port: 465,
  //   auth: {
  //     user: process.env.NOREPLY_EMAIL,
  //     pass: process.env.NOREPLY_PASSWORD,
  //   },
  // });

  // let mailOptions = {
  //   from: `${senderName || 'PeerStake'} <${process.env.NOREPLY_EMAIL}>`,
  //   to: sendee,
  //   subject: title,
  // text: message.text,
  // html: message.html,
  // };

  // return new Promise((resolve, reject) => {
  //   transporter.sendMail(mailOptions, function (err, info) {
  //     if (err) {
  //       console.log('Error while sending email => ' + err);
  //       reject('Error while sending email' + err);
  //     } else {
  //       console.log('Email sent => ', info);
  //       resolve(info);
  //     }
  //   });
  // });
}
