import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, Min, IsDate } from 'class-validator';
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
}