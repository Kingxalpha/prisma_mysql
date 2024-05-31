// import { Role } from "src/role/role.enum";

// export class CreateUserDto {
//     name:string;
//     email:string;
//     password:string;
//     role:Role
// }

import { IsString, IsEmail, IsEnum } from 'class-validator';
import { Role } from 'src/role/role.enum';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsEnum(Role, { message: 'role must be one of the following values: ADMIN, CLIENT, MODERATOR' })
  role: Role;
}
