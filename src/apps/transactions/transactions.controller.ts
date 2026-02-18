import {
  Controller,
  Get,
  Post,
  Body,
} from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ITransactionsService } from './transactions.service.abstract';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: ITransactionsService) { }

  @Post()
  create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.create(createTransactionDto);
  }
}
