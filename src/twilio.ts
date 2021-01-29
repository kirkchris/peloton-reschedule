import twilio from 'twilio';

const ACCOUNT_SID = 'AC2d6f4ba871c58f976f61a32c158399cf'; // Your Account SID from www.twilio.com/console
const AUTH_TOKEN = '03695a6bf46e6c6f6af3f80a94c407fd';   // Your Auth Token from www.twilio.com/console
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
