import { Author } from './Author.dto';

export class Commit {
  sha: string;
  url: string;
  commiter: Author;
  author: Author;
  message: string;
  htmlUrl: string;
}
