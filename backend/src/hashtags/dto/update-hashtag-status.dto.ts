import { IsInt, IsIn } from 'class-validator';
import { HASHTAG_STATUS } from '../../common/config/constants';

export class UpdateHashtagStatusDto {
  @IsInt()
  @IsIn([HASHTAG_STATUS.DISABLED, HASHTAG_STATUS.ACTIVE], {
    message: '状态必须是0（禁用）或1（启用）',
  })
  status: number;
}
