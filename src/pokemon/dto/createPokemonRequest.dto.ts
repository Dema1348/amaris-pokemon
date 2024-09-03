import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePokemonRequestDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'ditto' })
  name: string;
}
