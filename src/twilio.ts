import twilio from 'twilio';

const ACCOUNT_SID = 'CYZ'; // Your Account SID from www.twilio.com/console
const AUTH_TOKEN = 'CYZ';   // Your Auth Token from www.twilio.com/console
const TO_NUMBER = '+19163357435';
const FROM_NUMBER = '+12566009325';

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
