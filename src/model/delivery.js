import {Address} from './address';
import * as firebase from 'firebase';

export class Delivery {
  sender: string;
  recipientName: string;
  recipientPhoneNumber: string;
  recipientEmail: string;
  recipientAddress: Address;
  items: string;
  deliveryGeoLocation: firebase.firestore.GeoPoint;
  createdTimeStamp: number;
  deliveredTimeStamp: number;
  deliveryScheduleTimeStamp: number;
  status: 'onHold' | 'sended' | 'delivered' | 'canceled';
  key: string;
  companyKey: string;
  fromScuverRestaurant: string;
  scuverOrderKey: string;
  restaurantName: string;
  restaurantAddress: Address;
  photoUrl: string;
  paymentMethod: string;
  total: number;
}
