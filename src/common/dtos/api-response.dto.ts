import { ApiProperty } from '@nestjs/swagger';



/**

 * Standard API response wrapper for all endpoints

 * @template T - Type of the data payload

 */

export class ApiResponseDto<T = undefined> {

  @ApiProperty()

  success: true | false;



  @ApiProperty()

  message: string;



  @ApiProperty()

  data: T;



  constructor(partial: Partial<ApiResponseDto<T>>) {

    Object.assign(this, partial);

  }

}

