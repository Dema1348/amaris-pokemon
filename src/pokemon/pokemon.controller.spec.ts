import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';

import { PokemonController } from './pokemon.controller';
import { PokemonService } from './pokemon.service';
import { CreatePokemonRequestDto } from './dto/createPokemonRequest.dto';

jest.mock('./pokemon.service');

describe('PokemonController', () => {
  let pokemonController: PokemonController;
  let pokemonService: PokemonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PokemonController],
      providers: [
        PokemonService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    pokemonController = module.get<PokemonController>(PokemonController);
    pokemonService = module.get<PokemonService>(PokemonService);
  });

  describe('function create', () => {
    it('should create a new pokemon', async () => {
      const pokemon: CreatePokemonRequestDto = {
        name: 'ditto',
      };

      const spy = jest.spyOn(pokemonService, 'create');

      await pokemonController.create(pokemon);

      expect(spy).toBeCalled();
      expect(spy).toBeCalledTimes(1);
    });
  });
});
