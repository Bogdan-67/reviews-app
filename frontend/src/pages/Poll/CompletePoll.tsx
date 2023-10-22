import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import PollService from '../../services/PollService';
import { IPoll } from '../../models/IPoll';
import { Button, Result, message } from 'antd';
import { useForm } from 'react-hook-form';

type Props = {};

const CompletePoll = (props: Props) => {
  const { id } = useParams();
  const [poll, setPoll] = useState<IPoll>();
  const [error, setError] = useState('');
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
  });

  const fetchPoll = async () => {
    setError('');
    await PollService.getPoll(Number(id))
      .then((response) => {
        setPoll(response.data);
      })
      .catch((e) => {
        message.error(
          e.response.data.message ? e.response.data.message : e.message
        );
        setError(e.response.data.message ? e.response.data.message : e.message);
      });
  };

  useEffect(() => {
    if (id) {
      fetchPoll();
    }
  }, [id]);

  return (
    <>
      {error ? (
        <Result
          status="500"
          title="500"
          subTitle={error}
          extra={<Button type="primary">Вернуться в профиль</Button>}
        />
      ) : (
        <>{poll && <h1>{poll.name}</h1>}</>
      )}
    </>
  );
};

export default CompletePoll;
