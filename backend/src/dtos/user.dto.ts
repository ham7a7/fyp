export interface UpdateProfileDto {
  name: string;
  email: string;
}

export interface UpdatePasswordDto {
  currentPassword: string;
  newPassword: string;
}
