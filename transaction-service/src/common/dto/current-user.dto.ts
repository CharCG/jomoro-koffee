export type Role = 'GUEST' | 'CUSTOMER' | 'ADMIN';

export class CurrentUserDto {
  id!: number;
  role!: Role;
}
