import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseDto } from 'src/utils/Response.Dto';
import { Branch } from './Dto/Branch.dto';
import { AxiosError } from 'axios';

@Injectable()
export class BranchService {
  private readonly githubHost = process.env.GITHUBHOST;
  private readonly githubToken = process.env.GITHUBTOKEN;
  private readonly logger = new Logger(BranchService.name);

  constructor(private readonly httpService: HttpService) {}

  async GetBranches(userName: string, repoName: string): Promise<ResponseDto> {
    const branchesUrl = `${this.githubHost}/repos/${userName}/${repoName}/branches`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get(branchesUrl, {
          headers: {
            'Content-Type': 'application/vnd.github+json',
            Authorization: `Bearer ${this.githubToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new BadRequestException(error.response?.data);
          }),
        ),
    );

    const branches = this.parseToBranch(data) as Branch[];

    return {
      statusCode: status,
      body: branches,
      message: statusText,
    };
  }

  async GetBranch(userName: string, repoName: string, branchName: string) {
    const branchUrl = `${this.githubHost}/repos/${userName}/${repoName}/branches/${branchName}`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get(branchUrl, {
          headers: {
            'Content-Type': 'application/vnd.github+json',
            Authorization: `Bearer ${this.githubToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new BadRequestException(error.response?.data);
          }),
        ),
    );

    const branches = this.parseToBranch(data) as Branch;

    return {
      statusCode: status,
      body: branches,
      message: statusText,
    };
  }
  private parseToBranch(data: any | any[]): Branch | Branch[] {
    if (data instanceof Array) {
      const branches: Branch[] = [];
      data.forEach((value) => {
        const branch: Branch = {
          name: value.name,
          commit: value.commit,
          protected: value.protected,
        };
        branches.push(branch);
      });

      return branches;
    }

    return {
      name: data.name,
      commit: data.commit,
      protected: data.protected,
    };
  }
}
