import { Global, Module } from '@nestjs/common';
<<<<<<< HEAD
import { ConfigModule } from '@nestjs/config';
=======
>>>>>>> 22237fa (feat(transaction): add orders module with order history and detail endpoints)
import { PrismaService } from './prisma.service';

@Global()
@Module({
<<<<<<< HEAD
  imports: [ConfigModule],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
=======
  controllers: [],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
>>>>>>> 22237fa (feat(transaction): add orders module with order history and detail endpoints)
