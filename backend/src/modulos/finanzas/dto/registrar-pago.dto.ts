import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNumber, Min, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RegistrarPagoDto {
  @ApiProperty()
  @IsInt()
  plan_tratamiento_id: number;
  
  @ApiProperty()
  @Type(() => Date)
  @IsDate()
  fecha: Date;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  monto: number;
}