// Dtos are only for body params
export interface LoginDto {
    email: string;
    password: string;
}

export interface RegistrationDto {
    name: string;
    password: string;
    email: string;
}