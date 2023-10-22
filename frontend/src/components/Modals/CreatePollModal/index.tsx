import { Button, Modal, message } from 'antd';
import React, { useState } from 'react';
import CreatePollForm from '../../Forms/CreatePoll';

type Props = {
  id_request?: number;
};

const CreatePollModal = ({ id_request }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createPollFormRef = React.createRef<HTMLFormElement>();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    if (createPollFormRef.current) {
      createPollFormRef.current.submitForm();
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
        Создать опрос
      </Button>
      <Modal
        title="Создание опроса"
        open={isModalOpen}
        onOk={handleOk}
        okText={'Создать'}
        cancelText={'Отмена'}
        onCancel={handleCancel}
      >
        <CreatePollForm
          ref={createPollFormRef}
          title={false}
          showOkBtn={false}
          onSuccess={handleSuccess}
          onError={handleError}
          id_request={id_request}
        />
      </Modal>
    </>
  );
};

export default CreatePollModal;
