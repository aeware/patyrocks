export interface Account {
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
