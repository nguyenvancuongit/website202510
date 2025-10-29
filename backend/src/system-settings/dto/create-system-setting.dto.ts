import { IsString, IsNotEmpty, IsIn } from 'class-validator';

export class CreateSystemSettingDto {
  @IsString({ message: '设置键必须是字符串' })
  @IsNotEmpty({ message: '设置键不能为空' })
  key: string;

  @IsString({ message: '设置值必须是字符串' })
  @IsNotEmpty({ message: '设置值不能为空' })
  value: string;

  @IsString({ message: '设置类型必须是字符串' })
  @IsIn(['string', 'number', 'boolean', 'json'], {
    message: '设置类型必须是string、number、boolean或json之一',
  })
  type: string;
}
