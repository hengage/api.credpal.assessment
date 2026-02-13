import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, IsPositive } from "class-validator";
import { CurrencyCode } from "src/common/constants";

export class FundWalletDto {
    @ApiProperty({ example: 500.00, description: 'Amount in major units (e.g. 500.00 = ₦500)' })
    @IsNumber()
    @IsPositive()
    amount: number;

    @ApiProperty({ enum: CurrencyCode, example: CurrencyCode.NGN, description: 'Currency code (e.g. NGN)' })
    @IsEnum({ Currency: CurrencyCode.NGN }, { message: 'Currency must be NGN for funding' })
    currency: CurrencyCode;
}