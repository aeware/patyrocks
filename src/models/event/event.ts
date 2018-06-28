import { Injectable } from '@angular/core';

@Injectable()
export class Event {
  return:boolean;
  uid : string;
  uuid : string;
  auid : string;
  dateStart : string;
  timeStarts : string;
  duration : number;
  location : string;
  zipcode : string;
  complement : string;
  street : string;
  neighborhood : string;
  city : string;
  state : string;
  country : string;
  lat : string;
  lng : string;
  attendees : number;
  type : string;
  number : string;
  items : Array<Item>;
  valueTotal : number
}

export class Item {
  product_id: string;
  name: string;
  tag: string;
  qty: number;
  duration : number;
  attendees : number;
  type: string;
  value: number;
  total: number;
  vector: any;
  image: string;
  image_description: string;
  description: string;
  title_pop: string
}
