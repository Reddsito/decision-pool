import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env-config';
import { validationEnvSchema } from './config/env-validation';
import { PollsModule } from './modules/poll/polls.module';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { PollsGateway } from './modules/poll/polls.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      cache: true,
      isGlobal: true,
      validationSchema: validationEnvSchema,
    }),
    PollsModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
    PollsGateway,
  ],
})
export class AppModule {}
