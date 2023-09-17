import { Controller, Get, Param } from '@nestjs/common';
import { RepositoryService } from './repository.service';

@Controller('repos')
export class RepositoryController {
  constructor(private repositoryService: RepositoryService) {}

  @Get(':userName')
  async GetRepositories(@Param('userName') userName: string) {
    return await this.repositoryService.GetRepositories(userName);
  }

  @Get(':userName/:repoName')
  async GetRepository(
    @Param('userName') userName: string,
    @Param('repoName') repoName: string,
  ) {
    return await this.repositoryService.GetRepository(userName, repoName);
  }
}
