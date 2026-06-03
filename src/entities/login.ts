export interface User {
  [x: string]: string;
}
export interface Auth {
  auth: {
    id: string;
    name: string;
    password: string;
    email: string;
    token: string;
    isAdmin?: boolean | null;
    ramal_number?: string | number | null;
    user_registration?: string | null;
  };
}
