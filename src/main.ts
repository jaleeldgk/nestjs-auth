import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigModule } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';


ConfigModule.forRoot({
  isGlobal: true,
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipes
  app.useGlobalPipes(new ValidationPipe());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Sales Agent API')
    .setDescription('API documentation for authentication and other features')
    .setVersion('1.0')
    .addBearerAuth() // Enables JWT auth in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  app.use(helmet(  
    {
      contentSecurityPolicy: false // Disable CSP (for APIs)
    }  )); // Adds security headers

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
