import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsNotEmpty } from 'class-validator';

export class CrearOdontogramaDto {
  @ApiProperty({
    description: 'Objeto JSON que representa el estado de cada pieza dental.',
    example: { '18': 'caries', '17': 'ausente' },
  })
  @IsObject()
  @IsNotEmpty()
  datos: object;
}