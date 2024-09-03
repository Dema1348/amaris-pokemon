import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongodb';

export class CreatePokemonResponseDto {
  @ApiProperty({ example: '66d6495e2bae8efb06948424' })
  _id: ObjectId;

  @ApiProperty({ example: 'ditto' })
  name: string;

  @ApiProperty({ example: 12 })
  externalId: number;

  @ApiProperty({ example: 3 })
  weight: number;

  @ApiProperty({ example: 214 })
  order: number;

  @ApiProperty({ example: 110 })
  baseExperience: number;
}
