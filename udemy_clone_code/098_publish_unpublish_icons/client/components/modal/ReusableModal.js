import { Modal } from "antd";

const ReusableModal = ({ showModal, setShowModal, title = "", children }) => {
  return (
    <>
      <Modal
        title={title}
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
        // width={720}
        footer={null}
      >
        {children}
      </Modal>
    </>
  );
};

export default ReusableModal;
