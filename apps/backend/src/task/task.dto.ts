import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class TaskCreateDto {
  @IsNotEmpty()
  @IsString()
  readonly note: string;

  @IsNotEmpty()
  @IsDate()
  readonly date: Date;
}

export class TaskUpdateDto {
  @IsString()
  readonly note: string;

  @IsDate()
  readonly date: Date;
}
