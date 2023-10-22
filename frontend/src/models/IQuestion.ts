import { IOption } from './IOption';

export interface IQuestion {
  id_question: number;
  poll_id?: number;
  question_title: string;
  question_type_id: number;
  options?: Partial<IOption[]>;
}
