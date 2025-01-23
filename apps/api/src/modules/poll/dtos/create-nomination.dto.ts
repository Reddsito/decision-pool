import { IsString, Length } from 'class-validator';

export class CreateNominationDto {
  @IsString()
  @Length(1, 100)
  text: string;
}
