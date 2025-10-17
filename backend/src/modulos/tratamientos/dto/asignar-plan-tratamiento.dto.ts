import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsDateString } from 'class-validator';

export class AsignarPlanTratamientoDto {
  @ApiProperty()
  @IsInt()
  paciente_id: number;

  @ApiProperty()
  @IsInt()
  tratamiento_id: number;

  @ApiProperty({ description: 'Fecha de inicio del tratamiento en formato ISO 8601' })
  @IsDateString()
  fecha_inicio: string;
}