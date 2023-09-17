import { Injectable } from '@nestjs/common';
import { Repository } from './Dto/repository.dto';
import { HttpService } from '@nestjs/axios/dist';
import { firstValueFrom, catchError } from 'rxjs';
import { AxiosError } from 'axios';
import { ResponseDto } from 'src/utils/Response.Dto';

@Injectable()
export class RepositoryService {
  private readonly repositories: Repository[] = [];
  private githubHost?: string;
  private githubToken?: string;
  private reposPath?: string;
  private reposEndPoint?: string;

  constructor(private readonly httpService: HttpService) {
    this.githubToken = process.env.GITHUBTOKEN;
    this.githubHost = process.env.GITHUBHOST;
    this.reposPath = '/repos';
  }
  async GetRepositories(userName: string): Promise<ResponseDto> {
    this.reposEndPoint = `${this.githubHost}users/${userName}${this.reposPath}`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get(this.reposEndPoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.githubToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response?.data;
          }),
        ),
    );

    data.forEach((data: any) => {
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
      this.repositories.push(repository);
    });

    const response: ResponseDto = {
      statusCode: status,
      body: this.repositories,
      message: statusText,
    };

    return response;
  }
  async GetRepository(
    userName: string,
    repoName: string,
  ): Promise<ResponseDto> {
    this.reposEndPoint = `${this.githubHost}repos/${userName}/${repoName}`;
    const { data, status, statusText } = await firstValueFrom(
      this.httpService
        .get(this.reposEndPoint, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.githubToken}`,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            throw error.response?.data;
          }),
        ),
    );

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

    const response: ResponseDto = {
      statusCode: status,
      body: repository,
      message: statusText,
    };

    return response;
  }
}
