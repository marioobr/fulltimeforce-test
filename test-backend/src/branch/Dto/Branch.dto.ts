import { Commit } from 'src/commit/Dto/Commit.dto';

export class Branch {
  name: string;
  commit: Commit;
  protected: boolean;
}
