import { Button } from "antd";

const CategoryForm = ({ handleSubmit, name, setName, loading }) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleSubmit}>
        <div className="d-table-cell w-100">
          <input
            type="text"
            className="form-control square"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Catgory name"
            style={{ height: "40px" }}
            autoFocus
            required
          />
        </div>
        <div className="d-table-cell align-middle">
          <Button
            onClick={handleSubmit}
            className="btn btn-primary square"
            size="large"
            loading={loading}
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
