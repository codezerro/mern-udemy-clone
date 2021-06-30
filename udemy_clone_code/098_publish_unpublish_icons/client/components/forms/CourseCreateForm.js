import { Select, Button, Avatar, Badge } from "antd";
import { SaveOutlined, SyncOutlined } from "@ant-design/icons";
import MarkdownCheetsheet from "../modal/MarkdownCheatsheet";

const { Option } = Select;

const CourseCreateForm = ({
  values,
  setValues,
  handleChange,
  handleImage,
  handleSubmit,
  categoryList,
  setSelectedCategories,
  preview,
  uploadButtonText,
  handleImageRemove,
  markdownCheetsheetModal,
  setMarkdownCheetsheetModal = (f) => f,
}) => {
  // generate price
  const children = [];
  for (let i = 1.99; i <= 999.99; i++) {
    children.push(<Option key={i.toFixed(2)}>${i.toFixed(2)}</Option>);
  }

  return (
    <>
      <MarkdownCheetsheet
        markdownCheetsheetModal={markdownCheetsheetModal}
        setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
      />
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

        <div
          onClick={() => setMarkdownCheetsheetModal(!markdownCheetsheetModal)}
          className="text-center mb-4 pointer"
          style={{ height: "10px" }}
        >
          <b>Learn</b> to <i>write</i> in <code>markdown</code>
        </div>

        <div className="form-row">
          <div className="col">
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              className="form-control pt-4 markdown-textarea"
              placeholder="Description"
              cols="7"
              rows="7"
              required
            ></textarea>
          </div>
        </div>

        <div className="form-row pt-3">
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

          {values.paid && (
            <div className="col-md-6">
              <div className="form-group">
                <Select
                  defaultValue="$9.99"
                  style={{ width: "100%" }}
                  onChange={(v) => setValues({ ...values, price: v })}
                  tokenSeparators={[","]}
                  size="large"
                >
                  {children}
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <Select
                mode="multiple"
                allowClear
                placeholder="Select categories"
                style={{ width: "100%" }}
                size="large"
                onChange={(v) => setSelectedCategories(v)}
              >
                {categoryList.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>

        <div className="form-row">
          <div className="col">
            <div className="form-group">
              <label className="btn btn-dark btn-block text-left p-5">
                {uploadButtonText}
                <input
                  name="image"
                  onChange={handleImage}
                  type="file"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>
          </div>

          {preview && (
            <div>
              {/* <img
              src={preview}
              className="img img-fluid"
              style={{ objectFit: "cover", height: "120px" }}
            /> */}
              <Badge
                count="X"
                onClick={handleImageRemove}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  src={preview}
                  size={120}
                  shape="square"
                  className="ml-3"
                />
              </Badge>
            </div>
          )}
        </div>

        <div className="row">
          <div className="col">
            <Button
              onClick={handleSubmit}
              disabled={values.loading}
              className="btn btn-primary"
              type="primary"
              size="large"
              shape="round"
              loading={values.loading}
            >
              Save & Continue
            </Button>
          </div>
        </div>
      </form>
    </>
  );
};

export default CourseCreateForm;
