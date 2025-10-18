import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsDate, IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarEgresoDto {
  @ApiProperty()
  @IsString()
  concepto: string;

  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  fecha: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  monto: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  cita_id?: number;
}