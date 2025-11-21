// Dtos are only for body params
export interface LoginDto {
    username: string;
    password: string;
}

export interface RegistrationDto {
    name: string;
    password: string;
    email: string;
}