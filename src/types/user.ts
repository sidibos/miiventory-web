
export interface User {
    name: string;
    email: string;
    id: string;
    age: number;
    status: string;
    avatar?: string;
}

export const defaultNewUser: User = {
    name: '',
    id: '',
    email: '',
    age: 0,
    status: 'Active'
};
