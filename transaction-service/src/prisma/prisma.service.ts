import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
<<<<<<< HEAD
import { PrismaClient } from '../generated/prisma/client';
=======
import { PrismaClient } from '@prisma/client/extension';
>>>>>>> 22237fa (feat(transaction): add orders module with order history and detail endpoints)
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(private readonly configService: ConfigService) {
    super({
      adapter: new PrismaMariaDb({
        host: configService.get<string>('DATABASE_HOST'),
        port: Number(configService.get<string>('DATABASE_PORT')),
        user: configService.get<string>('DATABASE_USER'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        database: configService.get<string>('DATABASE_NAME'),
      }),
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> 22237fa (feat(transaction): add orders module with order history and detail endpoints)
