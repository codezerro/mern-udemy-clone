import { Button, Progress, Switch } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
import ReactPlayer from "react-player";
import MarkdownCheetsheet from "../../components/modal/MarkdownCheatsheet";

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploading,
  uploadVideoButtonText,
  handleVideo,
  progress,
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal = (f) => f,
}) => {
  return (
    <div className="container">
      <form onSubmit={handleUpdateLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          placeholder="Title"
          autoFocus
          required
        />

        <div
          onClick={() => setMarkdownCheetsheetModal(!markdownCheetsheetModal)}
          className="text-center pt-2 pb-3 pointer"
          style={{ height: "10px" }}
        >
          <b>Learn</b> to <i>write</i> in <code>markdown</code>
        </div>
        <MarkdownCheetsheet
          markdownCheetsheetModal={markdownCheetsheetModal}
          setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
        />

        <textarea
          className="form-control mt-3"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
          placeholder="Description"
          rows="4"
        ></textarea>

        <div>
          {!uploading && current.video && current.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
              {/* {current.video.Location} */}
              <ReactPlayer
                url={current.video.Location}
                width="410px"
                height="240px"
                controls
              />
            </div>
          )}
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadVideoButtonText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}
        {/* {current.free_preview ? "true" : "false"} */}
        <div className="d-flex justify-content-between">
          <span className="pt-3 badge">Preview</span>
          <Switch
            className="float-right mt-2"
            disabled={uploading}
            checked={current.free_preview}
            // onChange={(v) => setFree_preview(v)}
            name="free_preview"
            onChange={(v) => setCurrent({ ...current, free_preview: v })}
          />
        </div>

        <Button
          onClick={handleUpdateLesson}
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

export default UpdateLessonForm;
