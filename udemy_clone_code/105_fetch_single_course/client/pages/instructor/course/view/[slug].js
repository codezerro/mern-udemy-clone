import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Avatar, Tooltip, Button, Modal, List } from "antd";
import {
  EditOutlined,
  CheckOutlined,
  UploadOutlined,
  QuestionOutlined,
  CloseOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import ReactMarkdown from "react-markdown";
import AddLessonForm from "../../../../components/forms/AddLessonForm";
import { toast } from "react-toastify";

const { Item } = List;

const CourseView = () => {
  const [course, setCourse] = useState({});
  const [visible, setVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadButtonText, setUploadButtonText] = useState("Upload video");
  const [progress, setProgress] = useState(0);
  // values
  const [values, setValues] = useState({
    title: "",
    content: "",
    video: {},
  });
  const [students, setStudents] = useState(0);
  // markdown cheetsheet modal
  const [markdownCheetsheetModal, setMarkdownCheetsheetModal] = useState(false);

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    // console.log(slug);
    if (slug) fetchCourse();
  }, [slug]);

  useEffect(() => {
    course && studentCount();
  }, [course]);

  const fetchCourse = async () => {
    let { data } = await axios.get(`/api/course/${slug}`);
    // console.log(data);
    setCourse(data);
  };

  const studentCount = async () => {
    const { data } = await axios.post(`/api/instructor/student-count`, {
      courseId: course._id,
    });
    // console.log("STUDENT COUNT => ", data.length);
    setStudents(data.length);
  };

  const handleAddLesson = async (e) => {
    e.preventDefault();
    // console.log("**SEND TO BACKEND**", course);
    // console.table({ values });
    let { data } = await axios.post(`/api/course/lesson/${course._id}`, values);
    console.log("LESSON ADDED AND SAVED ===> ", data);
    setValues({ ...values, title: "", content: "", video: {} });
    setUploadButtonText("Upload video");
    setVisible(false);
    // push lessons to state then render
    setCourse(data);
    toast("Lesson added");
  };

  const handleVideo = async (e) => {
    try {
      const file = e.target.files[0];
      console.log(file);
      setUploadButtonText(file.name);
      setUploading(true);
      // send video as form data
      const videoData = new FormData();
      videoData.append("video", file);
      videoData.append("courseId", course._id);
      // save progress bar and send video as form data to backend
      const { data } = await axios.post(
        `/api/course/upload-video/${course._id}`,
        videoData,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((100 * e.loaded) / e.total)),
        }
      );
      // once response is received
      console.log(data);
      setValues({ ...values, video: data });
      setUploading(false);
      setProgress(0);
    } catch (err) {
      console.log(err);
      toast("Video upload failed");
    }
  };

  const handleVideoRemove = async () => {
    // remove video from s3
    const { data } = await axios.post(
      `/api/course/remove-video/${course._id}`,
      values.video
    );
    console.log("remove uploaded video", data);
    setValues({ ...values, video: {} });
    setProgress(0);
    setUploading(false);
    setUploadButtonText("Upload another video");
  };

  const handlePublish = async () => {
    // console.log(course.instructor._id);
    // return;
    try {
      let answer = window.confirm(
        "Once you publish your course, it will be live in the marketplace for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/publish/${course._id}`);
      // console.log("COURSE PUBLISHED RES", data);
      toast("Congrats. Your course is now live in marketplace!");
      setCourse(data);
    } catch (err) {
      toast("Course publish failed. Try again");
    }
  };

  const handleUnpublish = async () => {
    // console.log(slug);
    // return;
    try {
      let answer = window.confirm(
        "Once you unpublish your course, it will not appear in the marketplace for students to enroll."
      );
      if (!answer) return;
      const { data } = await axios.put(`/api/course/unpublish/${course._id}`);
      toast("Your course is now removed from the marketplace!");
      setCourse(data);
    } catch (err) {
      toast("Course unpublish failed. Try again");
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square p-3 mt-2 left-bottom-radius">
        Add Lessons
      </h1>

      {course && (
        <div className="container-fluid pt-1">
          <div className="media">
            <Avatar
              size={80}
              src={course.image ? course.image.Location : "/course.png"}
            />
            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <h5 className="mt-2 text-primary">{course.name}</h5>

                  <p style={{ marginTop: "-10px" }}>
                    {course.lessons && course.lessons.length} Lessons
                  </p>

                  <p style={{ marginTop: "-15px", fontSize: "10px" }}>
                    {course.categories &&
                      course.categories.map((category) => (
                        <span className="badge mr-1" key={category._id}>
                          {category.name}
                        </span>
                      ))}
                  </p>
                </div>

                {/* {JSON.stringify(course.published)} */}

                <div className="d-flex pt-4">
                  {/* total students enrolled */}
                  <Tooltip title={`${students} Enrolled`}>
                    <UserSwitchOutlined className="h5 pointer text-success mr-4" />
                  </Tooltip>
                  {/* edit icon */}
                  <Tooltip title="Edit">
                    <EditOutlined
                      onClick={() =>
                        router.push(`/instructor/course/edit/${slug}`)
                      }
                      className="h5 pointer text-warning mr-4"
                    />
                  </Tooltip>
                  {/* course published ? unpublished */}
                  {course.lessons && course.lessons.length < 5 ? (
                    <Tooltip title="Min 5 lessons required to publish">
                      <QuestionOutlined className="h5 pointer text-danger" />
                    </Tooltip>
                  ) : course.published ? (
                    <Tooltip title="Unpublish">
                      <CloseOutlined
                        onClick={handleUnpublish}
                        className="h5 pointer text-danger"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Publish">
                      <CheckOutlined
                        onClick={handlePublish}
                        className="h5 pointer text-success"
                      />
                    </Tooltip>
                  )}
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div className="row">
            <div className="col">
              <ReactMarkdown source={course.description} />
            </div>
          </div>
          <hr />
          <div className="row">
            <Button
              onClick={() => setVisible(true)}
              className="col-md-6 offset-md-3 text-center"
              type="primary"
              shape="round"
              icon={<UploadOutlined />}
              size="large"
            >
              Add Lesson
            </Button>
          </div>
          <Modal
            title="+ Add new"
            // width={720}
            centered
            visible={visible}
            onCancel={() => setVisible(false)}
            footer={null}
          >
            <AddLessonForm
              values={values}
              setValues={setValues}
              handleAddLesson={handleAddLesson}
              uploading={uploading}
              uploadButtonText={uploadButtonText}
              handleVideo={handleVideo}
              progress={progress}
              handleVideoRemove={handleVideoRemove}
              markdownCheetsheetModal={markdownCheetsheetModal}
              setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
            />
          </Modal>
          <hr />
          {/* {JSON.stringify(course)} */}
          <div className="row pb-5">
            <div className="col lesson-list">
              <h4>
                {course && course.lessons && course.lessons.length} Lessons
              </h4>
              <List
                itemLayout="horizontal"
                dataSource={course && course.lessons}
                renderItem={(item, index) => (
                  <Item>
                    <Item.Meta
                      avatar={<Avatar>{index + 1}</Avatar>}
                      title={item.title}
                    />
                  </Item>
                )}
              />
            </div>
          </div>
        </div>
      )}
    </InstructorRoute>
  );
};

export default CourseView;
