import { Test, TestingModule } from '@nestjs/testing';
import { HttpService, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { getModelToken } from 'nestjs-typegoose';
import { AxiosError, AxiosResponse } from 'axios';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import { of, throwError } from 'rxjs';

import { PokemonService } from './pokemon.service';
import { Pokemon } from './pokemon.model';

describe('PokemonService', () => {
  let pokemonService: PokemonService;
  let httpService: HttpService;

  const pokemonModel = getModelForClass(Pokemon, {
    schemaOptions: {
      collection: `pokemon-${Math.random().toString(36).substring(7)}`,
    },
  });

  const axiosMockResponse: AxiosResponse = {
    data: {
      base_experience: 101,
      height: 3,
      id: 132,
      is_default: true,
      location_area_encounters:
        'https://pokeapi.co/api/v2/pokemon/132/encounters',
      name: 'ditto',
      order: 214,
      past_abilities: [],
      past_types: [],
      species: {
        name: 'ditto',
        url: 'https://pokeapi.co/api/v2/pokemon-species/132/',
      },
      weight: 40,
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {},
  };

  const axiosMockResponseError: AxiosError = {
    response: {
      data: {
        error: {},
      },
      headers: {},
      config: {},
      status: 404,
      statusText: 'Not found',
    },
    config: {},
    isAxiosError: true,
    name: 'error',
    message: 'error',
    toJSON: () => Object,
  };

  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        PokemonService,
        {
          provide: getModelToken('Pokemon'),
          useValue: pokemonModel,
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    pokemonService = module.get<PokemonService>(PokemonService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should be defined', () => {
    expect(pokemonService).toBeDefined();
    expect(httpService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new pokemon', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(axiosMockResponse));

      const response = await pokemonService.create({
        name: 'ditto',
      });

      expect(response.name).toEqual('ditto');
      expect(response.baseExperience).toEqual(101);
      expect(response.order).toEqual(214);
      expect(response.externalId).toEqual(132);
      expect(response.weight).toEqual(40);
    });

    it('shouldnt call external service', async () => {
      await pokemonModel.create({
        name: 'ivysaur',
        externalId: 2,
        weight: 40,
        order: 214,
        baseExperience: 101,
      });

      const response = await pokemonService.create({ name: 'ivysaur' });

      expect(httpService.get).not.toBeCalled();
      expect(response.name).toEqual('ivysaur');
      expect(response.baseExperience).toEqual(101);
      expect(response.order).toEqual(214);
      expect(response.externalId).toEqual(2);
      expect(response.weight).toEqual(40);
    });

    it('shouldnt return a new error', async () => {
      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => throwError(axiosMockResponseError));

      await expect(
        pokemonService.create({ name: 'charmander' }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
