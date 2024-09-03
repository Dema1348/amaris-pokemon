import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppImports } from './app.imports';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { PokemonModule } from './pokemon/pokemon.module';

@Module({
  imports: [...AppImports, HealthModule, PokemonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
