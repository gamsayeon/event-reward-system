import { PartialType } from '@nestjs/mapped-types';
import { CreateRewardDto } from './reward.dto';

export class UpdateRewardDto extends PartialType(CreateRewardDto) {}
