export interface Client {
  id: string;
  name: string;
  phone?: string;
  job?: string;
  age?: number;
  lastVisit: Date;
  isNewClient: boolean;
}

export interface Reservation {
  id: string;
  clientName: string;
  date: string;
  time: string;
  hallName: string;
}