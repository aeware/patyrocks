import { Injectable } from '@angular/core';

@Injectable()
export class Shopping {
  public shopping_uid: string = '';
  public user_uid: string = '';
  public items : Array<Cart>;
  public items_total : number = 0;
  public total_value : number = 0.0;
  public finished: boolean = false;
}

export interface Cart {
  product_id: string,
  name: string,
  tag: string,
  qty: number,
  duration : number,
  attendees : number,
  type: string,
  value: number,
  total: number,
  vector: any,
  image: string,
  image_description: string,
  description: string,
  title_pop: string
}