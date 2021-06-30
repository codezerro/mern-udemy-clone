import { useContext } from "react";
import { Button, Modal, Card, Tooltip, Avatar } from "antd";
import {
  SyncOutlined,
  EditOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  RightCircleOutlined,
  CommentOutlined,
  PlusCircleFilled,
  EditFilled,
  DeleteFilled,
  CheckCircleFilled,
  CloseCircleFilled,
} from "@ant-design/icons";
import ReactMarkdown from "react-markdown";
import { Context } from "../../context";
import CodeBlock from "../../components/marked/CodeBlock";
import MarkdownCheetsheet from "../../components/modal/MarkdownCheatsheet";
import Link from "next/link";

const { Meta } = Card;

const QaCreateRead = ({
  visible,
  setVisible,
  values,
  setValues,
  handleCreatePost,
  clickedLessonQa = [],
  handleQaDelete = (f) => f,
  handleQaEdit = (f) => f,
  handleAddAnswer = (f) => f,
  handleEditAnswer = (f) => f,
  handleDeleteAnswer = (f) => f,
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal = (f) => f,
  markQaAsResolved = (f) => f,
  markQaAsNotResolved = (f) => f,
}) => {
  // state
  const {
    state: { user },
  } = useContext(Context);

  return (
    <>
      {/* <hr style={{ borderTop: "3px dashed #f6f6f6" }} /> */}

      {!visible && (
        <div className="row pt-4">
          <Button
            onClick={() => setVisible(true)}
            className="col-md-6 offset-md-3 text-center"
            type="primary"
            shape="round"
            icon={<QuestionCircleOutlined />}
            size="large"
          >
            Post A Question
          </Button>
        </div>
      )}
      {/* modal with form to create post */}
      <Modal
        title="Ask a question"
        width={720}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
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
        <form onSubmit={handleCreatePost}>
          <input
            type="text"
            className="form-control square"
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            value={values.title}
            placeholder="Title"
            autoFocus
            required
          />

          <textarea
            className="form-control mt-3 mb-1"
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
            value={values.description}
            rows="9"
            placeholder="Description"
          ></textarea>

          <Button
            onClick={handleCreatePost}
            className="col mt-2"
            size="large"
            type="primary"
            loading={values.loading}
            shape="round"
            disabled={values.loading || !values.title || !values.description}
          >
            {values.loading ? <SyncOutlined spin /> : "Submit"}
          </Button>
        </form>
      </Modal>

      {/* <pre>{JSON.stringify(clickedLessonQa, null, 4)}</pre> */}

      <div className="row pt-4">
        {clickedLessonQa.map((q) => (
          <div key={q._id} className="col-md-12 pt-2 pb-4">
            {/* {JSON.stringify(q)} */}

            <div className="p-3">
              <div className="d-flex pb-3">
                <Avatar>
                  <span>
                    {q.postedBy && q.postedBy.name && q.postedBy.name[0]}
                  </span>
                </Avatar>{" "}
                <span className="pl-2 pt-1">{q.postedBy.name}</span>
                <span className="pl-2 pt-1">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
                <span className="pt-1 ml-auto">
                  {q.answers && q.answers.length + " answers"}
                </span>
              </div>

              <h5>{q.title}</h5>

              <ReactMarkdown
                source={q.description}
                renderers={{ code: CodeBlock }}
                className="single-post"
              />

              {q.postedBy && user && user._id === q.postedBy._id ? (
                <div className="d-flex justify-content-around pt-3">
                  <Tooltip title="Add answer">
                    <PlusCircleFilled
                      onClick={() => handleAddAnswer(q)}
                      className="text-success"
                    />
                  </Tooltip>
                  <Tooltip onClick={() => handleQaEdit(q)} title="Edit">
                    <EditFilled className="text-warning" />
                  </Tooltip>
                  <Tooltip onClick={() => handleQaDelete(q)} title="Delete">
                    <DeleteFilled className="text-danger" />
                  </Tooltip>
                  <Tooltip
                    onClick={() =>
                      q.resolved ? markQaAsNotResolved(q) : markQaAsResolved(q)
                    }
                    title={q.resolved ? "Mark unresolved" : "Mark resolved"}
                  >
                    {q.resolved ? (
                      <CloseCircleFilled className="text-info" />
                    ) : (
                      <CheckCircleFilled className="text-info" />
                    )}
                  </Tooltip>
                </div>
              ) : (
                <div className="d-flex justify-content-around pt-3">
                  <Tooltip title="Add answer">
                    <PlusCircleOutlined
                      onClick={() => handleAddAnswer(q)}
                      className="text-success"
                    />
                  </Tooltip>
                  <Tooltip title={q.resolved ? "Resolved" : "Unresolved"}>
                    {q.resolved ? (
                      <CheckCircleFilled
                        style={{ cursor: "help" }}
                        className="text-info"
                      />
                    ) : (
                      <CloseCircleFilled
                        style={{ cursor: "help" }}
                        className="text-info"
                      />
                    )}
                  </Tooltip>
                </div>
              )}
            </div>

            {/* answers / comments */}
            {q.answers &&
              q.answers.map((a) => (
                <Card
                  key={a._id}
                  actions={
                    a.postedBy &&
                    user &&
                    user._id === a.postedBy._id && [
                      <Tooltip title="Edit answer">
                        <EditOutlined onClick={() => handleEditAnswer(a)} />
                      </Tooltip>,
                      <Tooltip title="Delete answer">
                        <DeleteOutlined onClick={() => handleDeleteAnswer(a)} />
                      </Tooltip>,
                    ]
                  }
                >
                  <Meta
                    avatar={<CommentOutlined />}
                    title={`By ${a.postedBy && a.postedBy.name} ${new Date(
                      q.createdAt
                    ).toLocaleDateString()}`}
                    description={
                      <ReactMarkdown
                        source={a.content}
                        renderers={{ code: CodeBlock }}
                        className="single-post"
                      />
                    }
                  />
                </Card>
              ))}
          </div>
        ))}
      </div>
    </>
  );
};

export default QaCreateRead;
