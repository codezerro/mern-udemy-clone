import { Select, Button } from "antd";

const { Option } = Select;

const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
}) => (
  <form onSubmit={handleSubmit}>
    <div className="form-group">
      <input
        type="text"
        name="name"
        className="form-control"
        placeholder="Name"
        value={values.name}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <textarea
        name="description"
        cols="7"
        rows="7"
        value={values.description}
        className="form-control"
        onChange={handleChange}
      ></textarea>
    </div>

    <div className="form-row">
      <div className="col">
        <div className="form-group">
          <Select
            style={{ width: "100%" }}
            size="large"
            value={values.paid}
            onChange={(v) => setValues({ ...values, paid: !values.paid })}
          >
            <Option value={true}>Paid</Option>
            <Option value={false}>Free</Option>
          </Select>
        </div>
      </div>
    </div>

    <div className="form-row">
      <div className="col">
        <div className="form-group">
          <label className="btn btn-outline-secondary btn-block text-left">
            {values.loading ? "Uploading" : "Image Upload"}
            <input
              type="file"
              name="image"
              onChange={handleImage}
              accept="image/*"
              hidden
            />
          </label>
        </div>
      </div>
    </div>

    <div className="row">
      <div className="col">
        <Button
          onClick={handleSubmit}
          disabled={values.loading || values.uploading}
          className="btn btn-primary"
          loading={values.loading}
          type="primary"
          size="large"
          shape="round"
        >
          {values.loading ? "Saving..." : "Save & Continue"}
        </Button>
      </div>
    </div>
  </form>
);

export default CourseCreateForm;
