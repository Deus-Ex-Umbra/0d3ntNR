import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CrearPacienteDto {
  @ApiProperty()
  @IsString()
  nombre: string;

  @ApiProperty()
  @IsString()
  apellidos: string;
  
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEmail()
  correo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiProperty({ description: "Notas generales sobre el paciente", required: false })
  @IsOptional()
  @IsString()
  notas_generales?: string;

  @ApiProperty({ description: "Alergias conocidas", required: false })
  @IsOptional()
  @IsString()
  alergias?: string;

  @ApiProperty({ description: "Enfermedades preexistentes", required: false })
  @IsOptional()
  @IsString()
  enfermedades?: string;

  @ApiProperty({ description: "Medicamentos que toma actualmente", required: false })
  @IsOptional()
  @IsString()
  medicamentos?: string;

  @ApiProperty({ description: "Otras notas médicas importantes", required: false })
  @IsOptional()
  @IsString()
  notas_medicas?: string;
  
  @ApiProperty({ description: "Color para categorización visual (ej. '#FF0000')", required: false })
  @IsOptional()
  @IsString()
  color_categoria?: string;
}