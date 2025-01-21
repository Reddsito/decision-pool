import { Module } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt-strategy';
import { jwtModule } from 'src/config/modules.config';

@Module({
  controllers: [],
  providers: [JwtStrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    jwtModule,
  ],
  exports: [JwtStrategy, PassportModule, jwtModule],
})
export class AuthModule {}
