import { Logger } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '../modules/redis/redis.module';
import { JwtModule } from '@nestjs/jwt';

export const redisModule = RedisModule.forRootAsync({
  useFactory: async (configService: ConfigService) => {
    const logger = new Logger('RedisModule');

    return {
      connectionOptions: {
        host: configService.get('redis.host'),
        port: configService.get('redis.port'),
      },
      onClientReady: (client) => {
        logger.log('Redis client ready');

        client.on('error', (err) => {
          logger.error('Redis Client Error: ', err);
        });

        client.on('connect', () => {
          logger.log(
            `Connected to redis on ${client.options.host}:${client.options.port}`,
          );
        });
      },
    };
  },
  imports: [ConfigModule],
  inject: [ConfigService],
});

export const jwtModule = JwtModule.registerAsync({
  useFactory: async (configService: ConfigService) => ({
    secret: configService.get('jwt.secret'),
    signOptions: {
      expiresIn: parseInt(configService.get('jwt.expiresIn')),
    },
  }),
  imports: [ConfigModule],
  inject: [ConfigService],
});
