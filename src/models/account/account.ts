import { Injectable } from '@angular/core';

@Injectable()
export class Account {
    uuid: string;
    name: string;
    email: string;
    password: string;
    deviceToken: string;
    facebookId: string;
    isStaff: boolean;
    logged : boolean;
    notifications: number;
    image: string;
}
