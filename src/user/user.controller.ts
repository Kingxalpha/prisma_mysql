import { Body, Controller, Post, Patch, UseGuards, Param, UnauthorizedException} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/role/role.enum';


@Controller('users')
export class UserController {
    constructor ( private readonly userService: UserService ) {}

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.userService.register(createUserDto)
    }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto) {
    try {
      const user = await this.userService.validateUser(loginUserDto.email, loginUserDto.password);
      if (user) {
        return this.userService.login(user);
      } else {
        return { message: 'Invalid credentials' };
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // @Post('login')
  // async login(@Body() LoginUserDto: { email: string, password: string }) {
  //   const user = await this.userService.validateUser(LoginUserDto.email, LoginUserDto.password);
  //   if (!user) {
  //     throw new UnauthorizedException('Invalid credentials');
  //   }
  //   return this.userService.login(user);
  // }

  @Patch('update-role/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN) //only users with the ADMIN role are allowed to access this endpoint. 
  async updateRole(@Param('id') id: number, @Body('role') role: Role) {
    const updatedUser = await this.userService.updateUserRole(id, role);
    return updatedUser;
  }
}

