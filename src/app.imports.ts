import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { Request } from 'express';
import { LoggerModule } from 'nestjs-pino';
import { TypegooseModule } from 'nestjs-typegoose';
import { TypegooseConfig } from './config/typegoose.config';

export const AppImports = [
  ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'test', 'staging', 'production')
        .default('development'),
      APP_PORT: Joi.number().default(3000),
      LOGGER_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'debug', 'log', 'silent')
        .default('debug'),
      MONGO_URL: Joi.required(),
      HOST_POKEMON: Joi.string().default('https://pokeapi.co'),
    }),
  }),
  LoggerModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => {
      return {
        pinoHttp: {
          reqCustomProps: (req: Request) => ({
            body: req.body,
          }),
          redact: {
            paths: [],
            censor: '********',
          },
          name: process.env.npm_package_name,
          level: config.get('LOGGER_LEVEL'),
          prettyPrint: false,
        },
      };
    },
  }),

  TypegooseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: async (config: ConfigService) => TypegooseConfig(config),
  }),
];
