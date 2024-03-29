import { Role } from '../common/interfaces/role.interface';

export interface JwtPayload {
  readonly user_id: string;
  readonly role: Role;
}
