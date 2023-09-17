import { Controller, Get, Param } from '@nestjs/common';
import { BranchService } from './branch.service';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}
  @Get(':userName/:repoName')
  async GetBranches(
    @Param('userName') userName: string,
    @Param('repoName') repoName: string,
  ) {
    return this.branchService.GetBranches(userName, repoName);
  }
  @Get(':userName/:repoName/:branchName')
  async GetBranch(
    @Param('userName') userName: string,
    @Param('repoName') repoName: string,
    @Param('branchName') branchName: string,
  ) {
    return this.branchService.GetBranch(userName, repoName, branchName);
  }
}
