import { HttpService, Injectable, NotFoundException } from '@nestjs/common';
import { ReturnModelType } from '@typegoose/typegoose';
import { InjectModel } from 'nestjs-typegoose';

import { Pokemon } from './pokemon.model';
import { CreatePokemonRequestDto } from './dto/createPokemonRequest.dto';
import { CreatePokemonResponseDto } from './dto/createPokemonResponse.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon)
    private readonly pokemonModel: ReturnModelType<typeof Pokemon>,
    public httpService: HttpService,
  ) {}

  async create({
    name,
  }: CreatePokemonRequestDto): Promise<CreatePokemonResponseDto> {
    try {
      const pokemon = await this.findPokemon(name);
      if (pokemon) return pokemon;

      const { data } = await this.httpService
        .get(`api/v2/pokemon/${name.toLocaleLowerCase()}`)
        .toPromise();

      const newPokemon = await this.pokemonModel.create({
        name: data.name || data.pokemon.name,
        externalId: data.id,
        weight: data.weight,
        order: data.order,
        baseExperience: data.base_experience,
      });

      return newPokemon;
    } catch (error) {
      if (error.response && error.response?.status === 404) {
        throw new NotFoundException(`Pokemon with name "${name}" not found.`);
      }
      throw error;
    }
  }

  async findPokemon(name: string): Promise<Pokemon> {
    const pokemon = await this.pokemonModel.findOne({
      name,
    });

    return pokemon;
  }
}
