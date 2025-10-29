import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateClientStatusDto {
  @IsNotEmpty()
  @IsEnum(['pending', 'active', 'disabled'])
  status: 'pending' | 'active' | 'disabled';
}
