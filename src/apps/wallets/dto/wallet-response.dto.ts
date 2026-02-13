import { ApiProperty } from "@nestjs/swagger";
import { ApiResponseDto } from "src/common/dtos/api-response.dto";

class FundWalletResponseDataDto {
    @ApiProperty({
        example: 'NGN',
        description: 'Currency code',
    })
    currency: string;

    @ApiProperty({
        example: 10000.89,
        description: 'Balance in major units',
    })
    balanceMajor: number;
}

export class FundWalletResponseDto extends ApiResponseDto<FundWalletResponseDataDto> {
    @ApiProperty({ type: FundWalletResponseDataDto })
    data: FundWalletResponseDataDto;
}

class GetWalletBalanceResponseDataDto {
    @ApiProperty({
        example: 'NGN',
        description: 'Currency code',
    })
    currency: string;

    @ApiProperty({
        example: 10000.89,
        description: 'Balance in major units',
    })
    balanceMajor: number;
}

class GetWalletResponseDataDto {
    @ApiProperty({
        example: '123e4567-e89b-12d3-a456-426614174000',
        description: 'Wallet ID',
    })
    walletId: string;

    @ApiProperty({
        type: [GetWalletBalanceResponseDataDto],
        description: 'Wallet balances',
    })
    balances: GetWalletBalanceResponseDataDto[];

}

export class GetWalletResponseDto extends ApiResponseDto<GetWalletResponseDataDto> {
    @ApiProperty({ type: GetWalletResponseDataDto })
    data: GetWalletResponseDataDto;
}