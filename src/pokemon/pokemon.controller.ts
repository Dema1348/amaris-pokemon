import { Controller, Post, HttpStatus, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { CreatePokemonRequestDto } from './dto/createPokemonRequest.dto';
import { PokemonService } from './pokemon.service';
import { ErrorResponseDto } from '../utils/dto/error.dto';
import { apiErrorWrapper } from '../utils/factories/apiErrorWrapper.factory';
import { CreatePokemonResponseDto } from './dto/createPokemonResponse.dto';
import { apiResponseWrapper } from '../utils/factories/apiResponseWrapper.factory';

@ApiTags('Pokemon')
@Controller('pokemon')
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @ApiOperation({
    summary: 'Create pokemon',
    description: 'Creates a pokemon by name',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: apiResponseWrapper(CreatePokemonResponseDto),
    description: 'Created',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    type: apiErrorWrapper(ErrorResponseDto),
    description: 'Pokemon not found',
  })
  @Post()
  async create(
    @Body() createPokmeonRequestDto: CreatePokemonRequestDto,
  ): Promise<CreatePokemonResponseDto> {
    return this.pokemonService.create(createPokmeonRequestDto);
  }
}
