export interface UserAuthI {
    name?: string;
    email: string;
    password: string;
}

export interface PlaceI {
    title: string;
    address: string;
    description: string;
}

export interface PlaceLocationI {
    lat: number;
    lng: number;
}
