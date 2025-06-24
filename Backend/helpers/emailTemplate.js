import { sender_email } from "../config/awsses.js";

const EmailTemplate = (receiver_email, subject, body) => {
  return {
    Source: sender_email,
    Destination: {
      ToAddresses: [receiver_email],
    },
    Message: {
      Subject: {
        Charset: "UTF-8",
        Data: ` Ora.com - ${subject} `,
      },

      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
             <html>
                  <body style="background-color: black; color: white; padding: 10px " >
                        <h1>Ora.com  </h1>                                 
                        ${body}                                   
                        <p>Thank you. </p>                                 
                       <p>Best Regards, Admin</p>
                  </body>  
             </html>      `,
        }, 
      },
    },
  };
};

export default EmailTemplate;
