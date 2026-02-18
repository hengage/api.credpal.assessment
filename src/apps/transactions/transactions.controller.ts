import { Controller, Get, Post, Body } from '@nestjs/common';
import { ITransactionsService } from './transactions.service.abstract';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: ITransactionsService) {}
}
