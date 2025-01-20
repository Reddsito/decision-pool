import { IsString, Length } from 'class-validator';

export class ReJoinPollDto {
  @IsString()
  @Length(6, 6)
  pollID: string;

  @IsString()
  @Length(21, 21)
  userID: string;

  @IsString()
  @Length(1, 25)
  name: string;
}
