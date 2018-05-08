export interface Event {
    return:boolean,
    uid : string,
    uuid : string,
    dateStart : string,
    timeStarts : string,
    duration : number,
    location : string,
    zipcode : string,
    complement : string,
    street : string,
    neighborhood : string,
    city : string,
    state : string,
    country : string,
    lat : string,
    lng : string,
    attendees : number,
    type : string,
    number : string,
    items : Array<params>,
    valueTotal : number;
  }

  export interface params {
    product_id: string,
    name: string,
    tag: string,
    qty: number,
    value: number,
    total: number,
    vector: any,
    image: string,
    description: string,
    title_pop: string
  }