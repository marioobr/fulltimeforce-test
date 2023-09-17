import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { Repository } from './Dto/repository.dto';
import { HttpService } from '@nestjs/axios/dist';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { ResponseDto } from 'src/utils/Response.Dto';

@Injectable()
export class RepositoryService {
  private readonly logger = new Logger(RepositoryService.name);
  private githubHost = process.env.GITHUBHOST;
  private githubToken = process.env.GITHUBTOKEN;

  constructor(private readonly httpService: HttpService) {}

  async GetRepositories(userName: string): Promise<ResponseDto> {
    const reposEndPoint = `${this.githubHost}/users/${userName}/repos`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get(reposEndPoint, {
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

    const repositories: Repository[] = this.parseToRepository(
      data,
    ) as Repository[];

    const response: ResponseDto = {
      statusCode: status,
      body: repositories,
      message: statusText,
    };

    return response;
  }

  async GetRepository(
    userName: string,
    repoName: string,
  ): Promise<ResponseDto> {
    const repoEndPoint = `${this.githubHost}/repos/${userName}/${repoName}`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get(repoEndPoint, {
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

    const repository: Repository = this.parseToRepository(data) as Repository;

    const response: ResponseDto = {
      statusCode: status,
      body: repository,
      message: statusText,
    };

    return response;
  }

  private parseToRepository(data: any | any[]): Repository | Repository[] {
    const repositories: Repository[] = [];

    if (data instanceof Array) {
      data.forEach((data) => {
        const repository: Repository = {
          id: data.id,
          name: data.name,
          fullName: data.full_name,
          description: data.description,
          url: data.url,
          private: data.private,
          branchesUrl: data.branches_url,
          commentsUrl: data.comments_url,
          commitsUrl: data.commits_url,
        };
        repositories.push(repository);
      });
      return repositories;
    }

    return {
      id: data.id,
      name: data.name,
      fullName: data.full_name,
      description: data.description,
      url: data.url,
      private: data.private,
      branchesUrl: data.branches_url,
      commentsUrl: data.comments_url,
      commitsUrl: data.commits_url,
    };
  }
}
