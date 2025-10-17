import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsNumber, Min } from 'class-validator';

export class CrearTratamientoDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  numero_citas: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  costo_total: number;
}