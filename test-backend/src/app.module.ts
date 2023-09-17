import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { RepositoryService } from './repository/repository.service';
import { RepositoryModule } from './repository/repository.module';
import { RepositoryController } from './repository/repository.controller';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { HttpModule } from '@nestjs/axios/dist/http.module';
import { CommitController } from './commit/commit.controller';
import { CommitService } from './commit/commit.service';
import { BranchController } from './branch/branch.controller';
import { BranchService } from './branch/branch.service';

@Module({
  imports: [
    RepositoryModule,
    AuthModule,
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [
    AuthController,
    RepositoryController,
    CommitController,
    BranchController,
  ],
  providers: [AuthService, RepositoryService, CommitService, BranchService],
})
export class AppModule {}
