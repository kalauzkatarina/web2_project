export interface User{
    id: string,
    firstName: string, 
    lastName: string, 
    email: string,
    role: string
}

export const emptyUser: User = {
  id: "",
  firstName: "",
  lastName: "",
  email: "",
  role: "",
};