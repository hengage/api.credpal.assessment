import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUserCtx } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FundWalletDto } from './dto/wallets.dto';
import { WalletsService } from './wallets.service';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';
import { FundWalletResponseDto, GetWalletResponseDto } from './dto/wallet-response.dto';

@Controller('wallet')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) { }

  @Post('fund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponseMessage('Wallet funded successfully')
  @ApiOkResponse({
    type: FundWalletResponseDto,
    description: 'Wallet funded successfully',
  })
  fundWallet(
    @CurrentUserCtx('id') userId: string,
    @Body() dto: FundWalletDto,
  ) {
    console.log('User ID:', userId);
    return this.walletsService.fundWallet(userId, dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponseMessage('Wallet retrieved')
  @ApiOkResponse({
    type: GetWalletResponseDto,
    description: 'Wallet retrieved',
  })
  getWallet(@CurrentUserCtx('id') userId: string) {
    return this.walletsService.getWallet(userId);
  }
}
