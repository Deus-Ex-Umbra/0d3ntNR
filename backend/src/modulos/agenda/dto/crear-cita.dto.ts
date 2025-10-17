import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearCitaDto {
  @ApiProperty({ required: false, description: 'ID del paciente (obligatorio si no es un evento general)' })
  @IsOptional()
  @IsInt()
  paciente_id?: number;

  @ApiProperty({ required: false, description: 'ID del plan de tratamiento al que pertenece la cita' })
  @IsOptional()
  @IsInt()
  plan_tratamiento_id?: number;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  fecha: Date;

  @ApiProperty()
  @IsString()
  descripcion: string;
}