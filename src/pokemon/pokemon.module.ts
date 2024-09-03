import { HttpModule, Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Pokemon } from './pokemon.model';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';

@Module({
  imports: [
    TypegooseModule.forFeature([Pokemon]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: 30000,
        baseURL: configService.get('HOST_POKEMON'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [PokemonService],
  controllers: [PokemonController],
})
export class PokemonModule {}
