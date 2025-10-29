import { IsInt, IsIn } from 'class-validator';
import { CUSTOMER_STATUS } from '../../common/config/constants';

export class UpdateCustomerStatusDto {
  @IsInt()
  @IsIn([
    CUSTOMER_STATUS.PENDING_FOLLOW_UP,
    CUSTOMER_STATUS.REGISTERED,
    CUSTOMER_STATUS.UNDER_FOLLOW_UP,
    CUSTOMER_STATUS.COOPERATING,
    CUSTOMER_STATUS.CANCELLED,
  ])
  status: number;
}
