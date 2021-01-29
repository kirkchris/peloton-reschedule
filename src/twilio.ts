import twilio from 'twilio';

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;   // Your Auth Token from www.twilio.com/console
const TO_NUMBER = process.env.TWILIO_TO_NUMBER;
const FROM_NUMBER = process.env.TWILIO_FROM_NUMBER;

const client = twilio(ACCOUNT_SID, AUTH_TOKEN);

export const sendMessage = async (message: string) => {
  try {
    console.log('sending message');
    await client.messages.create({
      body: message,
      to: TO_NUMBER,
      from: FROM_NUMBER
    });
    console.log('message sent');
  }
  catch (e) {
    console.error('failed to send message', e);
  }
};
