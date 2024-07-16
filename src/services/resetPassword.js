import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "raniahmohh@gmail.com",
    pass: "hjldccqbsmzbsfun",
  },
});


  export const sendResetPasswordEmail = async (email, otp) => {
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"JobSearchApp 👻" <raniahmohh@gmail.com>', // sender address
      to: email, // receiver address
      subject: "Password Reset OTP", // Subject line
      text: `Your OTP for password reset is: ${otp}`, // plain text body
      html: `<b>Your OTP for password reset is: ${otp}</b>`, // html body
    });

    console.log("Message sent: %s", info.messageId);
  };

  export default sendResetPasswordEmail