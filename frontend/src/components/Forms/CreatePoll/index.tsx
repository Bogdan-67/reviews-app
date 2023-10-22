import React, { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CreatePollSchema from '../../../models/validation/CreatePollSchema';
import { IPoll } from '../../../models/IPoll';
import {
  Button,
  Card,
  Col,
  Flex,
  Input,
  Row,
  Select,
  Space,
  Tooltip,
  message,
} from 'antd';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { IQuestionType } from '../../../models/IQuestionType';
import PollService from '../../../services/PollService';
import { Status } from '../../../models/Status.enum';

type Props = {};

const CreatePollForm = (props: Props) => {
  const {
    handleSubmit,
    getValues,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<Partial<IPoll>>({
    defaultValues: {
      name: '',
      comment: '',
      questions: [],
    },
    resolver: yupResolver(CreatePollSchema),
  });
  const [questions, setQuestions] = useState(getValues('questions'));
  const addButtonRef = useRef<HTMLButtonElement>(null);
  const [questionTypes, setQuestionTypes] = useState<IQuestionType[]>([]);
  const [questionTypesStatus, setQuestionTypesStatus] = useState(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  const getQuestionTypes = async () => {
    setQuestionTypesStatus(Status.LOADING);
    await PollService.fetchQuestionTypes()
      .then((response) => {
        setQuestionTypesStatus(Status.SUCCESS);
        setQuestionTypes(response.data);
      })
      .catch((e) => setQuestionTypesStatus(Status.ERROR));
  };
  useEffect(() => {
    getQuestionTypes();
  }, []);

  const addQuestion = () => {
    const idQuestion = Date.now();
    const newQuestion = {
      question_title: '',
      id_question: idQuestion,
      question_type_id: 1,
      options: [
        {
          id_option: Date.now(),
          text: '',
          question_id: idQuestion,
        },
      ],
    };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);

    const updatedQuestions = [...getValues('questions')];
    updatedQuestions.push(newQuestion);

    setValue('questions', updatedQuestions);
  };

  const removeQuestion = (questionIndex: number) => {
    const questions = [...getValues('questions')];
    questions.splice(questionIndex, 1);

    setQuestions(questions);

    console.log(questions);

    // Удалите соответствующее значение из формы
    setValue('questions', questions);
  };

  const updateQuestionType = (
    questionIndex: number,
    questionTypeId: number
  ) => {
    const updatedQuestions = [...getValues('questions')];
    updatedQuestions[questionIndex].question_type_id = questionTypeId;
    setQuestions(updatedQuestions);

    // Убедитесь, что вы также обновляете значение в форме
    setValue(`questions.${questionIndex}.question_type_id`, questionTypeId);
  };

  const addOption = (questionIndex: number) => {
    const newOption = {
      id_option: Date.now(),
      text: '',
      question_id: questions[questionIndex].id_question,
    };

    const updatedQuestions = [...getValues('questions')];
    if (!updatedQuestions[questionIndex].options)
      updatedQuestions[questionIndex].options = [];
    updatedQuestions[questionIndex].options.push(newOption);

    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...getValues('questions')];
    updatedQuestions[questionIndex].options = updatedQuestions[
      questionIndex
    ].options.filter((_, index) => index !== optionIndex);
    setQuestions(updatedQuestions);

    // Удалите соответствующее значение из формы
    setValue(
      `questions.${questionIndex}.options`,
      questions[questionIndex].options
    );
  };

  const submit: SubmitHandler<IPoll> = async (data) => {
    console.log(data);
    setIsSending(true);
    await PollService.createPoll(JSON.stringify(data))
      .then((response) => {
        message.success(response.data);
        reset();
      })
      .catch((e) =>
        message.error(
          e.response.data.message ? e.response.data.message : e.message
        )
      )
      .finally(() => setIsSending(false));
  };

  return (
    <form onSubmit={handleSubmit(submit)} style={{ padding: '15px' }}>
      <h2>Создание опроса</h2>
      <Flex vertical gap={'small'} style={{ padding: '15px 0' }}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <Input
                placeholder="Название"
                status={errors.name ? 'error' : ''}
                {...field}
              />
              {errors.name && <div>{errors.name.message}</div>}
            </>
          )}
        />
        <Controller
          name="comment"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <>
              <Input.TextArea
                placeholder="Комментарий"
                status={errors.comment ? 'error' : ''}
                {...field}
              />
              {errors.comment && <div>{errors.comment.message}</div>}
            </>
          )}
        />
      </Flex>

      <div>
        <h2>Вопросы</h2>
        {questions && questions.length > 0 && (
          <Row gutter={[15, 15]} style={{ paddingTop: '15px' }}>
            {questions.map((question, questionIndex) => (
              <Col span={24}>
                <Card
                  title={
                    <Row gutter={[15, 6]} style={{ padding: '9px 0' }}>
                      <Col span={24}>
                        <h4>Вопрос {questionIndex + 1}</h4>
                      </Col>
                      <Col span={10}>
                        <Controller
                          name={`questions.${questionIndex}.question_title`}
                          control={control}
                          defaultValue={question.question_title || ''}
                          render={({ field }) => (
                            <>
                              <Flex vertical>
                                <Input
                                  placeholder="Название вопроса"
                                  status={
                                    errors.questions &&
                                    errors.questions[questionIndex] &&
                                    errors.questions[questionIndex]
                                      .question_title
                                      ? 'error'
                                      : ''
                                  }
                                  {...field}
                                />
                                {errors.questions &&
                                  errors.questions[questionIndex] &&
                                  errors.questions[questionIndex]
                                    .question_title && (
                                    <div>
                                      {
                                        errors.questions[questionIndex]
                                          .question_title.message
                                      }
                                    </div>
                                  )}
                              </Flex>
                            </>
                          )}
                        />
                      </Col>
                      <Col span={8}>
                        <Controller
                          name={`questions.${questionIndex}.question_type_id`}
                          control={control}
                          defaultValue={question.question_type_id || 1}
                          render={({ field }) => (
                            <>
                              <Flex vertical>
                                <Select
                                  defaultActiveFirstOption={true}
                                  style={{ width: 120 }}
                                  onSelect={(value) => {
                                    field.onChange(value);
                                    updateQuestionType(questionIndex, value);
                                  }}
                                  options={questionTypes.map(
                                    (qt: IQuestionType) => ({
                                      value: qt.id_question_type,
                                      label: qt.type_name,
                                    })
                                  )}
                                  status={
                                    questionTypesStatus === Status.ERROR
                                      ? 'error'
                                      : ''
                                  }
                                  loading={
                                    questionTypesStatus === Status.LOADING
                                      ? true
                                      : false
                                  }
                                  {...field}
                                />
                                {errors.questions &&
                                  errors.questions[questionIndex] &&
                                  errors.questions[questionIndex]
                                    .question_type_id && (
                                    <div>
                                      {
                                        errors.questions[questionIndex]
                                          .question_type_id.message
                                      }
                                    </div>
                                  )}
                              </Flex>
                            </>
                          )}
                        />
                      </Col>
                    </Row>
                  }
                  extra={
                    <Tooltip title="Удалить вопрос">
                      <Button
                        danger
                        onClick={() => removeQuestion(questionIndex)}
                      >
                        <AiOutlineDelete />
                      </Button>
                    </Tooltip>
                  }
                >
                  {question.question_type_id !== 3 && (
                    <Flex vertical gap={'small'}>
                      {question.options && question.options.length > 0 && (
                        <Flex vertical gap={'small'}>
                          {question.options.map((option, optionIndex) => (
                            <Controller
                              name={`questions.${questionIndex}.options.${optionIndex}.text`}
                              control={control}
                              defaultValue={option.text || ''}
                              render={({ field }) => (
                                <>
                                  <Flex gap={'small'}>
                                    <Flex vertical>
                                      <Input
                                        placeholder="Вариант ответа"
                                        status={
                                          errors.questions &&
                                          errors.questions[questionIndex] &&
                                          errors.questions[questionIndex]
                                            .options &&
                                          errors.questions[questionIndex]
                                            .options[optionIndex]
                                            ? 'error'
                                            : ''
                                        }
                                        {...field}
                                      />
                                      {errors.questions &&
                                        errors.questions[questionIndex] &&
                                        errors.questions[questionIndex]
                                          .options &&
                                        errors.questions[questionIndex].options[
                                          optionIndex
                                        ] && (
                                          <div>
                                            {
                                              errors.questions[questionIndex]
                                                .options[optionIndex].message
                                            }
                                          </div>
                                        )}
                                    </Flex>
                                    <Tooltip
                                      title="Удалить вариант ответа"
                                      placement="right"
                                    >
                                      <Button
                                        danger
                                        onClick={() =>
                                          removeOption(
                                            questionIndex,
                                            optionIndex
                                          )
                                        }
                                      >
                                        <AiOutlineDelete />
                                      </Button>
                                    </Tooltip>
                                  </Flex>
                                </>
                              )}
                            />
                          ))}
                        </Flex>
                      )}

                      <Tooltip
                        title="Добавить вариант ответа"
                        placement="right"
                      >
                        <Button
                          ref={addButtonRef}
                          onClick={() => addOption(questionIndex)}
                          style={{ width: '100px' }}
                        >
                          <AiOutlinePlus />
                        </Button>
                      </Tooltip>
                    </Flex>
                  )}
                </Card>
              </Col>
            ))}
          </Row>
        )}
        <Tooltip title="Добавить вопрос" placement="right">
          <Button
            ref={addButtonRef}
            onClick={() => addQuestion()}
            style={{ width: '100%', marginTop: '15px' }}
          >
            <AiOutlinePlus />
          </Button>
        </Tooltip>
      </div>
      <Button
        loading={isSending}
        type="primary"
        htmlType="submit"
        style={{ marginTop: '15px' }}
      >
        Создать
      </Button>
    </form>
  );
};

export default CreatePollForm;
