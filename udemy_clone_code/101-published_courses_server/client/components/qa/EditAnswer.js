import { useContext } from "react";
import { Button, Modal, Card, Tooltip } from "antd";
import {
  SyncOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { Context } from "../../context";
import MarkdownCheetsheet from "../../components/modal/MarkdownCheatsheet";

const EditAnswer = ({
  answerEditModalVisible,
  setAnswerEditModalVisible,
  handleEditAnswerPost,
  answerEditLoading,
  currentAnswer = { content: "" },
  setCurrentAnswer,
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal = (f) => f,
}) => {
  // state
  const {
    state: { user },
  } = useContext(Context);

  return (
    <>
      {/* <hr style={{ borderTop: "3px dashed #f6f6f6" }} /> */}

      {/* modal with form to create post */}
      <Modal
        title="Edit your answer"
        width={720}
        centered
        visible={answerEditModalVisible}
        onCancel={() => setAnswerEditModalVisible(false)}
        footer={null}
      >
        <div
          onClick={() => setMarkdownCheetsheetModal(!markdownCheetsheetModal)}
          className="text-center mb-4 pointer"
        >
          <b>Learn</b> to <i>write</i> in <code>markdown</code>
        </div>
        <MarkdownCheetsheet
          markdownCheetsheetModal={markdownCheetsheetModal}
          setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
        />
        <form onSubmit={handleEditAnswerPost}>
          <textarea
            className="form-control mb-1"
            onChange={(e) =>
              setCurrentAnswer({ ...currentAnswer, content: e.target.value })
            }
            value={currentAnswer.content}
            rows="9"
          ></textarea>

          <Button
            onClick={handleEditAnswerPost}
            className="col mt-2"
            size="large"
            type="primary"
            shape="round"
            disabled={answerEditLoading || !currentAnswer.content}
          >
            {answerEditLoading ? <SyncOutlined spin /> : "Submit"}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditAnswer;
