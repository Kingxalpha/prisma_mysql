import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/role/role.enum';

@Injectable()
export class UserService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}


    async register(data: CreateUserDto): Promise<Omit<User, 'password'>> {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const role = data.role ?? Role.CLIENT;
        
        const user = await this.prismaService.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: hashedPassword,
                role: role,
            },
        });
    
        const { password, ...result } = user;
        return result;
    }
    

    async validateUser(email: string, password: string): Promise<User | null> {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log('User found:', user);
            console.log('Password valid:', isPasswordValid);
            if (isPasswordValid) {
                return user;
            }
        }
        return null;
    }

    async login(user: User) {
        const payload = { email: user.email, sub: user.id, role:user.role };
        return {
            access_token: this.jwtService.sign(payload, {
                secret: this.configService.get<string>('JWT_SECRET'),
            }),
        };
    }

    async updateUserRole(userId: number, role: Role): Promise<User> {
        return this.prismaService.user.update({
          where: { id: userId },
          data: { role },
        });
      }
}
