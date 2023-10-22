import * as Yup from 'yup';

const OptionSchema = Yup.object().shape({
  text: Yup.string().required('Поле "Вариант ответа" обязательно к заполнению'),
});

const QuestionSchema = Yup.object().shape({
  question_title: Yup.string().required(
    'Поле "Название вопроса" обязательно к заполнению'
  ),
  options: Yup.array().of(OptionSchema),
});

const CreatePollSchema = Yup.object().shape({
  name: Yup.string().required('Обязательное поле'),
  comment: Yup.string(),
});
export default CreatePollSchema;
