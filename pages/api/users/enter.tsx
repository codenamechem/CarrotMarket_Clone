import mail from "@sendgrid/mail";
import { NextApiRequest, NextApiResponse } from "next";
import withHandler, { ResponseType } from "@libs/server/withHandler";
import client from "@libs/server/client";
import twilio from "twilio";

//mail.setApiKey(process.env.SENDGRID_KEY!);

const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { email, phone } = req.body;
  console.log(req.body);
  const user = phone ? { phone: phone } : { email } ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + ""; // + "" 문자열로 만들어줌
  // const user = await client.user.upsert({
  //   where: {
  //     ...payload, // ...을 사용하여 중복되는것 제거
  //   },
  //   create: {
  //     name: "Anonmyus",
  //     ...payload,
  //   },
  //   update: {},
  //   //upsert는 DB를 찾아서 없으면 만들고 중복되면 업데이트까지 해줌.
  // });
  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          //기존 user를 찾고 token 연결, 유저가 없을 경우 새로 만듬.
          where: {
            ...user, // ...을 사용하여 중복되는것 제거
          },
          create: {
            name: "Anonmyus",
            ...user,
          },
        },
      },
    },
  });
  // Twilio로 payload 보내기
  if (phone) {
    // await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}`,
    // });
  } else if (email) {
    // const email = await mail.send({
    //   from: "fs926@naver.com",
    //   to: "fs926@naver.com",
    //   subject: "your Carrot Market Verification Email",
    //   text: `Your token is ${payload}`,
    //   html: `<strong>Your token is ${payload}</strong>`,
    // });
  }
  return res.json({ ok: true });
}
// let user;
// if (email) {
//   user = await client.user.findUnique({
//     where: {
//       email,
//     },
//   });
//   if (user) console.log("found it.");
//   if (!user) {
//     console.log("Did not find. Will create.");
//     user = await client.user.create({
//       data: {
//         name: "Anonymous",
//         email,
//       },
//     });
//   }
//   console.log(user);
// }
// if (phone) {
//   user = await client.user.findUnique({
//     where: {
//       phone: +phone,
//     },
//   });
//   if (user) console.log("found it.");
//   if (!user) {
//     console.log("Did not find. Will create.");
//     user = await client.user.create({
//       data: {
//         name: "Anonymous",
//         phone: +phone,
//       },
//     });
//   }
//   console.log(user);
// }

// function 안에 또다른 function 호출
export default withHandler("POST", handler);
