import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsInt, IsOptional, IsString, IsNumber, IsIn, ValidateIf } from 'class-validator';
import { Type } from 'class-transformer';

export class CrearCitaDto {
  @ApiProperty({ required: false, description: 'ID del paciente (obligatorio si se quiere monto y estado de pago)' })
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

  @ApiProperty({ required: false, enum: ['pendiente', 'pagado', 'cancelado'], description: 'Solo para citas con paciente' })
  @ValidateIf(o => o.paciente_id !== undefined && o.paciente_id !== null)
  @IsOptional()
  @IsIn(['pendiente', 'pagado', 'cancelado'])
  estado_pago?: string;

  @ApiProperty({ required: false, description: 'Solo para citas con paciente' })
  @ValidateIf(o => o.paciente_id !== undefined && o.paciente_id !== null)
  @IsOptional()
  @IsNumber()
  monto_esperado?: number;
}