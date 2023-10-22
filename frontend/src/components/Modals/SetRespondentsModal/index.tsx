import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import CreatePollForm from '../../Forms/CreatePoll';
import SetRespondentsForm from '../../Forms/SetRespondents';

type Props = {
  id_request?: number;
  author_id: number;
  poll_id: number;
};

const SetRespondentsModal = ({ id_request, author_id, poll_id }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const setRespondentsFormRef = React.createRef<HTMLFormElement>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (setRespondentsFormRef.current) {
      setRespondentsFormRef.current.submitForm();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
  };

  const handleError = (error: string) => {
    message.error(error);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Назначить респондентов
      </Button>
      <Modal
        title="Назначение респондентов"
        open={isModalOpen}
        onOk={handleOk}
        okText={'Назначить'}
        cancelText={'Отмена'}
        onCancel={handleCancel}
      >
        <SetRespondentsForm
          id_request={id_request}
          author_id={author_id}
          poll_id={poll_id}
        />
      </Modal>
    </>
  );
};

export default SetRespondentsModal;
