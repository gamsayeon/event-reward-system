export class CreateRewardDto {
  readonly rewardType: string;
  readonly rewardName: string;
  readonly description?: string;
  readonly quantity: number;
}
