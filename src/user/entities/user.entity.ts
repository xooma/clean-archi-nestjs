import { Entity } from '../../shared/entity';

type UserProps = {
  id: string;
  emailAdress: string;
  password: string;
};

export class User extends Entity<UserProps> {}