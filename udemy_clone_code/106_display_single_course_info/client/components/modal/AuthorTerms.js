import { Modal } from "antd";

const AuthorTerms = ({ showModal, setShowModal }) => {
  return (
    <>
      <Modal
        title="Why write on codecontinue?"
        visible={showModal}
        onCancel={() => setShowModal(!showModal)}
        // width={720}
        footer={null}
      >
        <ol>
          <li>
            Write what you know, what you learned and what you would like to
            share easily.
          </li>
          <li>
            Reach out to thousands of free and paid students at codecontinue
          </li>
          <li>Potential to promote your courses (if any) to wider audience</li>
          <li>Create, read, update or delete anytime</li>
          <li>Write in markdown supported editor</li>
          <li>SEO (Search Engine Optimized)</li>
        </ol>
      </Modal>
    </>
  );
};

export default AuthorTerms;
