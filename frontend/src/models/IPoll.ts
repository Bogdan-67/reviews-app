import { IQuestion } from './IQuestion';

export interface IPoll {
  id_poll: number;
  name: string;
  comment: string;
  questions?: Partial<IQuestion[]>;
}
