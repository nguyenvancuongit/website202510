import { IsOptional, IsEnum, IsDateString } from 'class-validator';

export class ExportClientsDto {
  @IsOptional()
  @IsEnum(['pending', 'active', 'disabled'])
  status?: 'pending' | 'active' | 'disabled';

  @IsOptional()
  @IsDateString()
  start_date?: string;

  @IsOptional()
  @IsDateString()
  end_date?: string;
}
