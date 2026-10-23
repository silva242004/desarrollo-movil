// Firestore (Contactos)
export interface Contact {
  id: string;
  name: string;
  phone: string;
  uid: string;
}

// Realtime Database (Tasks)
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
}
