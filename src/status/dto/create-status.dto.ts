import { ApiProperty } from "@nestjs/swagger";
import { $Enums, Prisma, Status } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateStatusDto implements Partial<Prisma.StatusCreateInput> {
  @ApiProperty({
    description: `
    type of status content. the value for this input can be found in /
    `,
    enum: $Enums.TYPE_OF_CONTENT
  })
  @IsNotEmpty()
  @IsEnum($Enums.TYPE_OF_CONTENT)
  type_of_content: $Enums.TYPE_OF_CONTENT;
  
  
  @ApiProperty({
    description: `
    Content for user's status can be text, image, or video
    `
  })
  @IsOptional()
  @IsString()
  description: string;
  
  @ApiProperty({
    description: `
    Media contains url of saved media from api /file-upload/{bucket}
    `
  })
  @IsOptional()
  @IsString()
  media: string;
}
