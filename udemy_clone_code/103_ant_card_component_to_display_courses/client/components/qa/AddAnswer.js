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

const AddAnswer = ({
  answerModalVisible,
  setAnswerModalVisible,
  answerContent,
  setAnswerContent,
  handleAnswerPost,
  answerLoading,
  currentQuestion = { title: "" },
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
        title={`Answer > ${currentQuestion.title}`}
        width={720}
        centered
        visible={answerModalVisible}
        onCancel={() => setAnswerModalVisible(false)}
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
        <form onSubmit={handleAnswerPost}>
          <textarea
            className="form-control mb-1"
            onChange={(e) => setAnswerContent(e.target.value)}
            value={answerContent}
            rows="9"
            placeholder="Write your answer.."
          ></textarea>

          <Button
            onClick={handleAnswerPost}
            className="col mt-2"
            size="large"
            type="primary"
            shape="round"
            disabled={answerLoading || !answerContent}
          >
            {answerLoading ? <SyncOutlined spin /> : "Submit"}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default AddAnswer;
