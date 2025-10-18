import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, IsDate, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarPagoDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  plan_tratamiento_id?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  cita_id?: number;
  
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
  @IsString()
  concepto?: string;
}