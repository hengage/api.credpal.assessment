import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('CredPal FX Trading API')
    .setDescription(
      'Multi-currency FX trading platform where users can trade Naira (NGN) against international currencies. Features include user authentication, multi-currency wallets, real-time FX rates, currency conversion, and comprehensive transaction history.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'User registration, login, and email verification')
    .addTag('Wallets', 'Multi-currency wallet management and funding')
    .addTag('FX Trading', 'Currency conversion and trading operations')
    .addTag('Transactions', 'Transaction history and audit trail')
    .addTag('FX Rates', 'Real-time foreign exchange rates')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document, {
    useGlobalPrefix: true,
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
}
