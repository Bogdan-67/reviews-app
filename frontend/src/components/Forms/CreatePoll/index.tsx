import React, { useRef, useState } from 'react';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import CreatePollSchema from '../../../models/validation/CreatePollSchema';
import { IOption } from '../../../models/IOption';
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
} from 'antd';
import { AiOutlineDelete, AiOutlinePlus } from 'react-icons/ai';
import { features } from 'process';

type Props = {};

const CreatePollForm = (props: Props) => {
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm<Partial<IPoll>>({
    defaultValues: {
      questions: [],
    },
    resolver: yupResolver(CreatePollSchema),
  });
  const [questions, setQuestions] = useState(getValues('questions'));
  const addButtonRef = useRef<HTMLButtonElement>(null);

  const addQuestion = () => {
    const newQuestion = {
      question_title: '',
      id_question: Date.now(),
      question_type_id: 1,
      options: [],
    };

    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
  };

  const removeQuestion = (questionIndex: number) => {
    const questions = [...getValues('questions')];
    questions.splice(questionIndex, 1);

    setQuestions(questions);

    console.log(questions);

    // Удалите соответствующее значение из формы
    setValue('questions', questions);
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
  };

  return (
    <form onSubmit={handleSubmit(submit)}>
      <h2>Создание опроса</h2>
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
            <Input
              placeholder="Комментарий"
              status={errors.comment ? 'error' : ''}
              {...field}
            />
            {errors.comment && <div>{errors.comment.message}</div>}
          </>
        )}
      />

      <div>
        <h3>Вопросы</h3>
        {questions && questions.length > 0 && (
          <Row gutter={[15, 15]} style={{ padding: '15px' }}>
            {questions.map((question, questionIndex) => (
              <Col span={24}>
                <Card
                  title={
                    <Row gutter={15}>
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
                                  defaultValue={1}
                                  style={{ width: 120 }}
                                  onChange={field.onChange}
                                  options={[
                                    { value: 1, label: 'Один из нескольких' },
                                    {
                                      value: 2,
                                      label: 'Несколько из нескольких',
                                    },
                                    { value: 3, label: 'Собственный ответ' },
                                  ]}
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
                  {question.options && question.options.length > 0 && (
                    <Flex vertical>
                      {question.options.map((option, optionIndex) => (
                        <Controller
                          name={`questions.${questionIndex}.options.${optionIndex}.text`}
                          control={control}
                          defaultValue={option.text || ''}
                          render={({ field }) => (
                            <>
                              <Flex>
                                <Flex vertical>
                                  <Input
                                    placeholder="Вариант ответа"
                                    status={
                                      errors.questions &&
                                      errors.questions[questionIndex] &&
                                      errors.questions[questionIndex].options &&
                                      errors.questions[questionIndex].options[
                                        optionIndex
                                      ]
                                        ? 'error'
                                        : ''
                                    }
                                    {...field}
                                  />
                                  {errors.questions &&
                                    errors.questions[questionIndex] &&
                                    errors.questions[questionIndex].options &&
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
                                <Tooltip title="Удалить вариант ответа">
                                  <Button
                                    danger
                                    onClick={() =>
                                      removeOption(questionIndex, optionIndex)
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

                  <Tooltip title="Добавить вариант ответа">
                    <Button
                      ref={addButtonRef}
                      onClick={() => addOption(questionIndex)}
                    >
                      <AiOutlinePlus />
                    </Button>
                  </Tooltip>
                </Card>
              </Col>
            ))}
          </Row>
        )}
        <Tooltip title="Добавить вопрос">
          <Button ref={addButtonRef} onClick={() => addQuestion()}>
            <AiOutlinePlus />
          </Button>
        </Tooltip>
      </div>
      <Button type="primary" htmlType="submit">
        Создать
      </Button>
    </form>
  );
};

export default CreatePollForm;
