// src/event/dto/create-reward.dto.ts
export class CreateRewardDto {
  readonly type: string;
  readonly quantity: number;
  readonly description?: string;
}
