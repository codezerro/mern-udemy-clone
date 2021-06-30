import { useState, useEffect } from "react";
import { Tooltip } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import AdminRoute from "../../../components/routes/AdminRoute";
import CategoryForm from "../../../components/forms/CategoryForm";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

const AdminCategoryIndex = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [update, setUpdate] = useState(false);
  const [slug, setSlug] = useState("");

  let router = useRouter();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      let { data } = await axios.get("/api/categories");
      setCategories(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      let { data } = await axios.post("/api/category", { name });
      // console.log(data);
      setName("");
      setLoading(false);
      toast("Category created");
      // update state
      setCategories([data, ...categories]);
    } catch (err) {
      toast(err.response.data);
      setLoading(false);
      console.log(err.response);
    }
  };

  const handleDeleteClick = async (c) => {
    try {
      let { data } = await axios.delete(`/api/category/${c.slug}`);
      // console.log(c.slug);

      toast(`${data.name} is deleted`);
      // update state
      let filtered = categories.filter((category) => category.slug !== c.slug);
      setCategories(filtered);
    } catch (err) {
      toast(err.response.data);
      console.log(err.response);
    }
  };

  const handleUpdateClick = (c) => {
    setUpdate(true);
    setName(c.name);
    setSlug(c.slug);
    // console.log(c.name, update);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      let { data } = await axios.put(`/api/category/${slug}`, { name });
      // console.log("updated", data);
      toast(`${data.name} is updated`);
      // update state, first remove updated category
      let filtered = categories.filter((category) => category.slug !== slug);
      // insert updated category
      setCategories([data, ...filtered]);
      // remove name and slug from state
      setName("");
      setSlug("");
      setUpdate(false);
    } catch (err) {
      toast(err.response.data);
      console.log(err.response);
    }
  };

  return (
    <AdminRoute>
      <CategoryForm
        handleSubmit={update ? handleUpdate : handleSubmit}
        name={name}
        setName={setName}
        loading={loading}
      />
      <hr />
      {categories.map((c) => (
        <div className="d-inline-flex p-1" key={c._id}>
          <span className="badge badge-pill badge-secondary p-2">
            <Tooltip
              title={
                <>
                  <EditOutlined
                    className="pointer"
                    onClick={() => handleUpdateClick(c)}
                  />{" "}
                  <DeleteOutlined
                    className="pointer"
                    onClick={() => handleDeleteClick(c)}
                  />
                </>
              }
            >
              {c.name}
            </Tooltip>
          </span>
        </div>
      ))}
    </AdminRoute>
  );
};

export default AdminCategoryIndex;
