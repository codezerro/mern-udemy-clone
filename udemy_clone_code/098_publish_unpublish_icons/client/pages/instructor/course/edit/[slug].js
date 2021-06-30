import { useEffect, useState } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import CourseEditForm from "../../../../components/forms/CourseEditForm";
import axios from "axios";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { List, Avatar, Modal } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import UpdateLessonForm from "../../../../components/forms/UpdateLessonForm";

const { Item } = List;

const CourseEdit = () => {
  // state
  const [values, setValues] = useState({
    _id: "",
    name: "",
    description: "",
    price: "9.99",
    paid: true,
    loading: false,
    image: {},
    categories: [],
    lessons: [],
    instructor: {},
  });

  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload image");

  /**
   * LESSON UPDATE
   */
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState({});
  const [uploadVideoButtonText, setUploadVideoButtonText] = useState(
    "Upload video"
  );
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  // markdown cheetsheet modal
  const [markdownCheetsheetModal, setMarkdownCheetsheetModal] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  // fetch course
  useEffect(() => {
    // console.log(slug);
    if (slug) fetchCourse();
  }, [slug]);

  useEffect(() => {
    loadCategories();
  }, []);

  const fetchCourse = async () => {
    let { data } = await axios.get(`/api/course/${slug}`);
    // console.log(data);
    setValues(data);
    // push array of categories to be used by ant select component
    if (data) {
      let arr = [];
      data.categories && data.categories.map((c) => arr.push(c._id));
      setSelectedCategories(arr);
    }
  };

  const loadCategories = async () => {
    const { data } = await axios.get("/api/categories");
    // console.log(data);
    setCategoryList(data);
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
    // console.log(e.target.name, " ----- ", e.target.value);
  };

  const handleSubmit = async (e) => {
    // console.log("HANDLE SUBMIT => ", values);
    try {
      const { data } = await axios.put(`/api/course/${values._id}`, {
        ...values,
        categories: selectedCategories,
      });
      // console.log(data);
      toast("Updated!");
      // router.push("/instructor");
    } catch (err) {
      console.log(err);
      toast(err.response.data);
    }
  };

  const handleImage = async (e) => {
    // remove previous image
    if (values.image && values.image.Location) {
      // console.log("YES VALUES IMAGE", values.image);
      let { data } = await axios.post(
        `/api/course/remove-image/${values._id}`,
        {
          image: values.image,
        }
      );
      // console.log("removed previous image", data);
    }

    console.log(e.target.files[0]);
    let file = e.target.files[0];
    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    Resizer.imageFileResizer(
      file, // file
      720, // maxWidth
      500, // maxHeight
      "JPEG", // compressionFormat
      100, // quality
      0, // rotation
      async (uri) => {
        // post to s3
        try {
          let { data } = await axios.post("/api/course/upload-image", {
            image: uri,
          });
          // console.log("image uploaded", data);
          setValues({ ...values, image: data, loading: false });
          setUploadButtonText("Upload image");
        } catch (err) {
          setValues({ ...values, loading: false });
          setUploadButtonText("Upload image");
          toast("Image upload failed. Try again.");
          console.log(err);
        }
      },
      "base64" // outputType
    );
  };

  // drag events
  // set key > 'itemIndex' in 'e' object
  const handleDrag = (e, index) => {
    console.log("ON DRAG", index);
    e.dataTransfer.setData("itemIndex", index);
  };

  const handleDrop = async (e, index) => {
    console.log("ON DROP", index);

    const movingItemIndex = e.dataTransfer.getData("itemIndex");
    const targetItemIndex = index; // targeted item on drop
    let allLessons = values.lessons;

    let movingItem = allLessons[movingItemIndex]; // clicked/dragged item to re-order
    allLessons.splice(movingItemIndex, 1); // remove 1 item from the given index
    allLessons.splice(targetItemIndex, 0, movingItem); // push item after target item index

    setValues({ ...values, lessons: allLessons });
    // make request to backend to save the re-ordered lessons
    // console.log("SEND TO BACKEND", values.lessons);
    const { data } = await axios.put(`/api/course/${values._id}`, {
      ...values,
      categories: selectedCategories,
    });
    console.log(data);
    toast("Saved!");
  };

  const handleDeleteLesson = async (index) => {
    let answer = window.confirm("Are you sure?");
    if (!answer) return;
    let allLessons = values.lessons;
    const removed = allLessons.splice(index, 1);
    // remove previous video
    if (removed && removed.length && removed[0].video) {
      let res = await axios.post(
        `/api/course/remove-video/${values._id}`,
        removed[0].video
      );
      console.log(res);
    }

    setValues({ ...values, lessons: allLessons });
    // console.log("removed", removed, "slug", slug);`
    const { data } = await axios.post(
      `/api/course/${values._id}/${removed[0]._id}`
    );
    if (data.ok) toast("Deleted");
    console.log("delete lesson => ", data);
  };

  const handleVideo = async (e) => {
    // remove previous
    if (current.video && current.video.Location) {
      const res = await axios.post(
        `/api/course/remove-video/${values._id}`,
        current.video
      );
      console.log("REMOVED ===> ", res);
    }
    // upload
    const file = e.target.files[0];
    console.log(file);
    setUploadButtonText(file.name);
    setUploading(true);
    // send video as form data
    const videoData = new FormData();
    videoData.append("video", file);
    videoData.append("courseId", values._id);
    // save progress bar and send video as form data to backend
    const { data } = await axios.post(
      `/api/course/upload-video/${values._id}`,
      videoData,
      {
        onUploadProgress: (e) =>
          setProgress(Math.round((100 * e.loaded) / e.total)),
      }
    );
    // once response is received
    console.log(data);
    setCurrent({ ...current, video: data });
    setUploading(false);
  };

  const handleUpdateLesson = async (e) => {
    e.preventDefault();
    // console.log("CURRENT", current);
    // console.log("**SEND TO BACKEND**");
    // console.table({ values });
    let { data } = await axios.post(
      `/api/course/lesson/${values._id}/${current._id}`,
      current
    );
    // console.log("LESSON UPDATED AND SAVED ===> ", data);
    setUploadButtonText("Upload video");
    setProgress(0);
    setVisible(false);
    // update lessons
    if (data.ok) {
      let arr = values.lessons;
      const index = arr.findIndex((el) => el._id === current._id);
      arr[index] = current;
      setValues({ ...values, lessons: arr });
      toast("Lesson updated");
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square p-3 mt-2 left-bottom-radius">
        Update Course
      </h1>

      <div className="pb-5">
        <CourseEditForm
          values={values}
          setValues={setValues}
          handleChange={handleChange}
          handleImage={handleImage}
          handleSubmit={handleSubmit}
          categoryList={categoryList}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          preview={preview}
          uploadButtonText={uploadButtonText}
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          markdownCheetsheetModal={markdownCheetsheetModal}
          setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
        />
      </div>

      {/* {JSON.stringify(current)} */}

      <hr />
      <div className="row pb-5">
        <div className="col lesson-list">
          <h4>{values && values.lessons && values.lessons.length} Lessons</h4>
          <List
            onDragOver={(e) => e.preventDefault()}
            itemLayout="horizontal"
            dataSource={values && values.lessons}
            renderItem={(item, index) => (
              <Item
                draggable
                onDragStart={(e) => handleDrag(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                className="pointer"
              >
                <Item.Meta
                  onClick={() => {
                    setVisible(true);
                    setCurrent(item);
                  }}
                  avatar={<Avatar>{index + 1}</Avatar>}
                  title={item.title}
                />

                <DeleteOutlined
                  onClick={() => handleDeleteLesson(index, item)}
                  className="text-danger float-right"
                />
              </Item>
            )}
          />
        </div>
      </div>

      <Modal
        title="Update"
        // width={720}
        centered
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <UpdateLessonForm
          current={current}
          setCurrent={setCurrent}
          uploadVideoButtonText={uploadVideoButtonText}
          progress={progress}
          handleVideo={handleVideo}
          handleUpdateLesson={handleUpdateLesson}
          uploading={uploading}
          markdownCheetsheetModal={markdownCheetsheetModal}
          setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
        />
        {/* <pre>{JSON.stringify(current, null, 4)}</pre> */}
      </Modal>
    </InstructorRoute>
  );
};

export default CourseEdit;
