import { Button, Progress, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import MarkdownCheetsheet from "../../components/modal/MarkdownCheatsheet";

const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
  handleVideoRemove,
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal = (f) => f,
}) => {
  return (
    <div className="container">
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
      <form onSubmit={handleAddLesson}>
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
          className="form-control mt-3"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          value={values.content}
          placeholder="Content"
          rows="4"
        ></textarea>

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadButtonText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>
          {!uploading && values.video.Location && (
            <Tooltip title="Remove">
              <span onClick={handleVideoRemove} className="pt-1 pl-3">
                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <Button
          onClick={handleAddLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
          disabled={uploading}
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default AddLessonForm;
