import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { firstValueFrom, catchError } from 'rxjs';
import { Commit } from './Dto/Commit.dto';
import { ResponseDto } from 'src/utils/Response.Dto';

@Injectable()
export class CommitService {
  private readonly logger = new Logger(CommitService.name);
  constructor(private readonly httpService: HttpService) {}

  private githubHost = process.env.GITHUBHOST;
  private githubToken = process.env.GITHUBTOKEN;
  async getCommits(userName: string, repoName: string): Promise<ResponseDto> {
    const commitsEndpoint = `${this.githubHost}/repos/${userName}/${repoName}/commits`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get<any[]>(commitsEndpoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.githubToken}222`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.error(error.response?.data);
            throw new BadRequestException(error.response?.data);
          }),
        ),
    );

    const commits: Commit[] = this.parseToCommit(data) as Commit[];

    const response: ResponseDto = {
      statusCode: status,
      body: commits,
      message: statusText,
    };

    return response;
  }
  async getCommitsByUrl(commitsUrl: string): Promise<ResponseDto> {
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get<any[]>(commitsUrl, {
          headers: {
            'Content-Type': 'application/json',
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

    const commits: Commit[] = this.parseToCommit(data) as Commit[];

    const response: ResponseDto = {
      statusCode: status,
      body: commits,
      message: statusText,
    };

    return response;
  }
  async getCommit(
    userName: string,
    repoName: string,
    commitSha: string,
  ): Promise<ResponseDto> {
    const commitsEndpoint = `${this.githubHost}/repos/${userName}/${repoName}/commits/${commitSha}`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get<any>(commitsEndpoint, {
          headers: {
            'Content-Type': 'application/json',
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

    const commit: Commit = this.parseToCommit(data) as Commit;

    const response: ResponseDto = {
      statusCode: status,
      body: commit,
      message: statusText,
    };

    return response;
  }
  async getCommitByUrl(commitUrl: string): Promise<ResponseDto> {
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get<any>(commitUrl, {
          headers: {
            'Content-Type': 'application/json',
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

    const commit: Commit = this.parseToCommit(data) as Commit;

    const response: ResponseDto = {
      statusCode: status,
      body: commit,
      message: statusText,
    };

    return response;
  }

  private parseToCommit(data: any | any[]): Commit | Commit[] {
    const commits: Commit[] = [];
    if (data instanceof Array) {
      data.forEach((data) => {
        const commit: Commit = {
          sha: data.sha,
          url: data.url,
          author: data.commit.author,
          commiter: data.commit.commiter,
          message: data.commit.message,
          htmlUrl: data.html_url,
        };
        commits.push(commit);
      });
      return commits;
    }
    return {
      sha: data.sha,
      url: data.url,
      author: data.commit.author,
      commiter: data.commit.commiter,
      message: data.commit.message,
      htmlUrl: data.html_url,
    };
  }
}
