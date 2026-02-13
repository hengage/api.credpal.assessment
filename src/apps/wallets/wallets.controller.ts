import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUserCtx } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { FundWalletDto } from './dto/wallets.dto';
import { WalletsService } from './wallets.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) { }

  @Post('fund')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ResponseMessage('Wallet funded successfully')
  fundWallet(
    @CurrentUserCtx('id') userId: string,
    @Body() dto: FundWalletDto,
  ) {
    console.log('User ID:', userId);
    return this.walletsService.fundWallet(userId, dto);
  }

}
