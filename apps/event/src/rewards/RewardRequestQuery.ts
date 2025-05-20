import { RewardRequestFilter } from './RewardRequestFilter';

export interface RewardRequestQuery extends RewardRequestFilter {
  userId?: string;
}
