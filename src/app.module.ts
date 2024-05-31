import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth/jwt-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileModule } from './file.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/roles.guard';
import { AuthMiddleware } from './auth/authenticated.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PostModule,
    UserModule,
    PrismaModule,
    PassportModule,
    FileModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, JwtStrategy, {
    provide: APP_GUARD,
    useClass: RolesGuard,
  }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/posts/create-post', method: RequestMethod.ALL });
  }
}

// export class AppModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer
//       .apply(AuthMiddleware)
//       .forRoutes(
//         { path: '/create-post', method: RequestMethod.ALL },
//         // Apply to other routes as needed
//       );
//   }
// }
