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

const QaEdit = ({
  editModalVisible,
  setEditModalVisible,
  editValues,
  setEditValues,
  handleEditPost,
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal = (f) => f,
}) => {
  // state
  const {
    state: { user },
  } = useContext(Context);

  return (
    <>
      {/* modal with form to create post */}
      <Modal
        title={editValues.title}
        width={720}
        centered
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
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
        <form onSubmit={handleEditPost}>
          <input
            type="text"
            className="form-control square"
            onChange={(e) =>
              setEditValues({ ...editValues, title: e.target.value })
            }
            value={editValues.title}
            placeholder="Title"
            autoFocus
            required
          />

          <textarea
            className="form-control mt-3 mb-1"
            onChange={(e) =>
              setEditValues({ ...editValues, description: e.target.value })
            }
            value={editValues.description}
            rows="9"
            placeholder="Description"
          ></textarea>

          <Button
            onClick={handleEditPost}
            className="col mt-2"
            size="large"
            type="primary"
            loading={editValues.loading}
            shape="round"
            disabled={
              editValues.loading || !editValues.title || !editValues.description
            }
          >
            {editValues.loading ? <SyncOutlined spin /> : "Submit"}
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default QaEdit;
