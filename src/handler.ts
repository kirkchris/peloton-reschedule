import fetch from 'isomorphic-fetch';
import get from 'lodash/get';
import { sendMessage } from './twilio';

const ID = process.env.PELOTON_ORDER_ID;

const updateDelivery = async (newDelivery: any) => {
  const data = {
    operationName: 'OrderSetDeliveryPreference',
    variables: {
      deliveryId: newDelivery.id,
      isReschedule: true,
      id: ID,
    },
    query: 'mutation OrderSetDeliveryPreference($deliveryId: ID!, $id: ID!, $isReschedule: Boolean = false) {\n  orderSetDeliveryPreference(deliveryId: $deliveryId, orderId: $id, isReschedule: $isReschedule) {\n    deliveryPreference { id }\n  }\n}\n',
  };

  try {
    const result = await fetch('https://graph.prod.k8s.onepeloton.com/graphql', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': "application/json",
      }
    });
    return result;
  } catch (e) {
    console.error('error in mutation', e);
  }

  return null;
};

export const run = async () => {
  const data = {
    operationName: "OrderDelivery",
    variables: {
      isReschedule: true,
      id: ID
    },
    query: "query OrderDelivery($id: ID!, $isReschedule: Boolean = false) {\n  order(id: $id) {\n    canSetDeliveryPreference\n    canReschedule\n    canSelectTimeSlot\n    deliveryPreference {\n      date\n      start\n      end\n      __typename\n    }\n    availableDeliveries(limit: 3, isReschedule: $isReschedule) {\n      id\n      date\n      start\n      end\n      __typename\n    }\n    __typename\n  }\n  postPurchaseFlow(id: $id) {\n    permission\n    __typename\n  }\n}\n"
  };

  console.log('---- starting ----');
  try {
    const vals = await fetch('https://graph.prod.k8s.onepeloton.com/graphql', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': "application/json",
      }
    });

    const response = await vals.json();
    console.log('response', response);
    const currentDeliveryDate = new Date(get(response, ['data', 'order', 'deliveryPreference', 'date'], '2021-03-15'));
    const deliveryPreferences = get(response, ['data', 'order', 'availableDeliveries'], []);
    console.log('currentDeliveryDate', currentDeliveryDate);
    console.log('deliveryPreferences', deliveryPreferences);

    const potentialDelivery = deliveryPreferences[0];
    if (potentialDelivery) {
      const potentialDeliveryDate = new Date(potentialDelivery.date);
      if (potentialDeliveryDate < currentDeliveryDate) {
        console.log('FOUND EARLIER DATE', currentDeliveryDate, potentialDeliveryDate);
        await sendMessage(`Found earlier date ${potentialDelivery.date}. Reschedule here: https://www.onepeloton.com/delivery/05b7a7ecde0b404dae24be3df9aa7d09/reschedule`);
        const resp = await updateDelivery(potentialDelivery);
        if (resp) {
          console.log('MOVED TO EARLIER DELIVERY DATE');
        }
      }
      else {
        console.log('later delivery date', currentDeliveryDate, potentialDeliveryDate);
      }
    }
  } catch (e) {
    console.error('in main processing error', e);
    throw e;
  } finally {
    console.log('--- ending ---');
  }
};
