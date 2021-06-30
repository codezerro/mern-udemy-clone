import { Button, Progress, Tooltip } from "antd";
import { CloseCircleFilled, CloseCircleOutlined } from "@ant-design/icons";

const UpdateLessonForm = ({
  current,
  setCurrent,
  handleUpdateLesson,
  uploading,
  uploadVideoButtonText,
  handleVideo,
  progress,
}) => {
  return (
    <div className="container pt-3">
      {/* {JSON.stringify(current)} */}
      <form onSubmit={handleUpdateLesson}>
        <input
          type="text"
          className="form-control square"
          onChange={(e) => setCurrent({ ...current, title: e.target.value })}
          value={current.title}
          autoFocus
          required
        />

        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setCurrent({ ...current, content: e.target.value })}
          value={current.content}
        ></textarea>

        <div className="d-flex justify-content-center">
          <label className="btn btn-dark btn-block text-left mt-3">
            {uploadVideoButtonText}
            <input onChange={handleVideo} type="file" accept="video/*" hidden />
          </label>

          {!uploading && current.video && current.video.Location && (
            <div className="pt-2 d-flex justify-content-center">
              show video player on react player
            </div>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2"
            percent={progress}
            steps={10}
          />
        )}

        <div className="d-flex justify-content-between">
          <span className="pt-3 badge">Preview</span>
        </div>

        <Button
          onClick={handleUpdateLesson}
          className="col mt-3"
          size="large"
          type="primary"
          loading={uploading}
          shape="round"
        >
          Save
        </Button>
      </form>
    </div>
  );
};

export default UpdateLessonForm;
