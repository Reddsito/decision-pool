import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { envConfig } from './config/env-config';
import { validationEnvSchema } from './config/env-validation';
import { PollsModule } from './modules/poll/polls.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      cache: true,
      isGlobal: true,
      validationSchema: validationEnvSchema,
    }),
    PollsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
