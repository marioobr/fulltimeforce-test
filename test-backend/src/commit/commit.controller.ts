import { Controller, Get, Param, Query } from '@nestjs/common';
import { CommitService } from './commit.service';
import { CommitParams } from './Dto/CommitParams.dto';

@Controller('commits')
export class CommitController {
  constructor(private readonly commitService: CommitService) {}

  @Get(':userName/:repoName')
  async getCommits(
    @Param('repoName') repoName: string,
    @Param('userName') userName: string,
    @Query() query?: CommitParams,
  ) {
    if (query) {
      return await this.commitService.getCommits(userName, repoName, query);
    }
    return await this.commitService.getCommits(userName, repoName);
  }

  @Get(':userName/:repoName/:commitSha')
  async getCommit(
    @Param('userName') userName: string,
    @Param('repoName') repoName: string,
    @Param('commitSha') commitSha: string,
  ) {
    return await this.commitService.getCommit(userName, repoName, commitSha);
  }

  @Get(':commitsUrl')
  async getCommistByUrl(@Param('commitsUrl') commitsUrl: string) {
    return await this.commitService.getCommitsByUrl(commitsUrl);
  }

  @Get(':commitUrl')
  async getCommitByUrl(@Param('commitUrl') commitUrl: string) {
    return await this.commitService.getCommitByUrl(commitUrl);
  }
}
