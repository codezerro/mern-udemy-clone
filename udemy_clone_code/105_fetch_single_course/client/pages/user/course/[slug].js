import { useState, useEffect, createElement, useContext } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Button, Menu, Avatar } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlayCircleOutlined,
  CheckCircleFilled,
  MinusCircleFilled,
  PieChartOutlined,
} from "@ant-design/icons";
import StudentRoute from "../../../components/routes/StudentRoute";
import ReactPlayer from "react-player";
import ReactMarkdown from "react-markdown";
import QaCreateRead from "../../../components/qa/QaCreateRead";
import AddAnswer from "../../../components/qa/AddAnswer";
import EditAnswer from "../../../components/qa/EditAnswer";
import QaEdit from "../../../components/qa/QaEdit";
import { toast } from "react-toastify";
import { Context } from "../../../context";
import { useWindowWidth } from "@react-hook/window-size";
import CodeBlock from "../../../components/marked/CodeBlock";

const { Item } = Menu;

const SingleCourse = () => {
  // state
  const {
    state: { user },
  } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState({ lessons: [] });
  // for sidebar
  const [clicked, setClicked] = useState(-1);
  const [collapsed, setCollapsed] = useState(false);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [updateState, setUpdateState] = useState(false);
  // for qa
  const [visible, setVisible] = useState(false);
  const [values, setValues] = useState({
    title: "",
    description: "",
    loading: false,
  });
  const [clickedLessonQa, setClickedLessonQa] = useState([]);
  // for qa update
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editValues, setEditValues] = useState({
    _id: "",
    title: "",
    description: "",
    loading: false,
  });
  // for adding answer
  const [answerModalVisible, setAnswerModalVisible] = useState(false);
  const [answerContent, setAnswerContent] = useState("");
  const [answerLoading, setAnswerLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState({});

  // for answer update
  const [answerEditModalVisible, setAnswerEditModalVisible] = useState(false);
  const [answerEditLoading, setAnswerEditLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState({});

  // markdown cheetsheet modal
  const [markdownCheetsheetModal, setMarkdownCheetsheetModal] = useState(false);

  // router
  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    if (slug) loadCourse();
  }, [slug]);

  useEffect(() => {
    if (course) loadCompletedLessons();
  }, [course]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/user/course/${slug}`);
    console.log("USER COURSE => ", data);
    setCourse(data);
  };

  // use POST route to avoid mongo objectId string issue
  const loadCompletedLessons = async () => {
    const { data } = await axios.post(`/api/list-completed`, {
      courseId: course._id,
    });
    console.log("COMPLETED LESSONS => ", data);
    setCompletedLessons(data);
  };

  // unless it's very last video
  // each time video ends, send lesson id to backend and store as completed
  const markCompleted = async () => {
    // console.log(course.lessons[clicked]._id, course._id);
    const { data } = await axios.post(`/api/mark-completed`, {
      courseId: course._id,
      lessonId: course.lessons[clicked]._id,
    });
    // console.log(data);
    setCompletedLessons([...completedLessons, course.lessons[clicked]._id]);
  };

  const markIncomplete = async () => {
    try {
      // console.log(course.lessons[clicked]._id, course._id);
      const { data } = await axios.post(`/api/mark-incomplete`, {
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
      });
      // console.log(data);
      // remove the 'mark incomplete' id from completedLessons
      const all = completedLessons;
      //   console.log("ALL ======> ", all);
      const index = all.indexOf(course.lessons[clicked]._id);
      if (index !== -1) {
        all.splice(index, 1);
        console.log("ALL WITHOUT REMOVED =====> ", all);
        setCompletedLessons(all);
        setUpdateState(!updateState);
      }
    } catch (err) {
      console.log(err);
    }
  };

  /**
   * =========================
   * QA
   * =========================
   */

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      setValues({ ...values, loading: true });
      // console.log("handle create post => ", values);
      let allData = {
        ...values,
        courseId: course._id,
        lessonId: course.lessons[clicked]._id,
        userId: user._id,
      };
      const { data } = await axios.post("/api/qa", allData);
      // console.log("QA CREATE => ", data);
      setValues({ ...values, title: "", description: "", loading: false });
      // setClickedLessonQa([data, ...clickedLessonQa]);
      loadQuestions();
      setVisible(false);
    } catch (err) {
      console.log(err);
      setValues({ ...values, loading: false });
      toast(err.response.data);
    }
  };

  useEffect(() => {
    if (clicked !== -1) loadQuestions();
  }, [clicked]);

  const loadQuestions = async (req, res) => {
    const { data } = await axios.get(`/api/qa/${course.lessons[clicked]._id}`);
    // console.log(data);
    setClickedLessonQa(data);
  };

  const handleQaDelete = async (q) => {
    try {
      let answer = confirm("Are you sure you want to delete?");
      // if (answer) console.log("handle qa delete", qaId);
      if (!answer) return;
      const { data } = await axios.delete(`/api/qa/${q._id}/${q.postedBy._id}`);
      // console.log("DELETED QA => ", data);
      loadQuestions();
    } catch (err) {
      toast("Delete failed. Try again.");
    }
  };

  const handleQaEdit = (q) => {
    // console.log("EDIT CLICKED =>", q);
    setEditValues(q);
    setEditModalVisible(!editModalVisible);
  };

  const handleEditPost = async () => {
    console.log("editvalues => ", editValues);
    try {
      // console.log("EDIT POST REQ => ", editValues);
      const { data } = await axios.put(`/api/qa/${editValues._id}`, editValues);
      // console.log("EDIT POST RES => ", data);
      loadQuestions();
      setEditModalVisible(false);
      toast("Edit successful");
    } catch (err) {
      console.log(err);
      toast("Edit failed. Try again.");
    }
  };

  /**
   * add answer to qa
   */

  const handleAddAnswer = (q) => {
    setAnswerModalVisible(true);
    setCurrentQuestion(q);
  };

  const handleAnswerPost = async () => {
    try {
      setAnswerLoading(true);
      const { data } = await axios.put(`/api/qa/answer`, {
        questionId: currentQuestion._id,
        content: answerContent,
        userId: user._id,
      });
      setAnswerContent("");
      setAnswerModalVisible(false);
      loadQuestions();
      setAnswerLoading(false);
      toast("New answer added");
      // console.log("ANSEWR ADDED =>", data);
    } catch (err) {
      console.log(err);
      setAnswerLoading(false);
      toast("Unauthorized");
    }
  };

  const handleEditAnswer = async (a) => {
    // console.log("handle edit ans qa", q._id, a._id);
    setAnswerEditModalVisible(true);
    setCurrentAnswer(a);
  };

  const handleEditAnswerPost = async () => {
    try {
      setAnswerEditLoading(true);
      // console.log("handleEditAnswerPost => currentanswer", currentAnswer);
      const { data } = await axios.put(`/api/qa/answer-edit`, currentAnswer);
      // console.log("ANSWER EDIT RES", data);
      loadQuestions();
      setAnswerEditModalVisible(false);
      setCurrentAnswer({});
      setAnswerEditLoading(false);
      toast("Answer successfully updated");
    } catch (err) {
      toast("Error updating. Try again.");
      setAnswerEditLoading(false);
    }
  };

  const handleDeleteAnswer = async (a) => {
    try {
      let answer = confirm("Are you sure you want to delete?");
      // if (answer) console.log("handle qa delete", qaId);
      if (!answer) return;
      // console.log("handle delete ans qa", a._id);
      const { data } = await axios.delete(
        `/api/qa/answer-delete/${a._id}/${a.postedBy._id}`
      );
      loadQuestions();
      toast("Answer successfully deleted");
    } catch (err) {
      toast("Delete failed. Try again.");
    }
  };

  const markQaAsResolved = async (q) => {
    try {
      // console.log("mark as resolved", q._id, q.postedBy._id);
      const { data } = await axios.put(`/api/qa/mark-resolved`, {
        questionId: q._id,
        postedBy: q.postedBy._id,
      });
      loadQuestions();
      console.log("MARK RESOLVED => ", data);
      toast("You marked it resolved");
    } catch (err) {
      // console.log(err);
      toast("Mark resolved failed. Try again.");
    }
  };

  const markQaAsNotResolved = async (q) => {
    try {
      // console.log("mark as resolved", q._id, q.postedBy._id);
      const { data } = await axios.put(`/api/qa/mark-unresolved`, {
        questionId: q._id,
        postedBy: q.postedBy._id,
      });
      loadQuestions();
      console.log("MARK RESOLVED => ", data);
      toast("You marked it resolved");
    } catch (err) {
      // console.log(err);
      toast("Mark resolved failed. Try again.");
    }
  };

  /**
   * collapse sidebar on window resize
   */
  const onlyWidth = useWindowWidth();
  useEffect(() => {
    console.log("onlyWidth", onlyWidth);
    if (onlyWidth < 800) {
      setCollapsed(true);
    } else if (onlyWidth > 800) {
      setCollapsed(false);
    }
  }, [onlyWidth < 800]);

  return (
    <StudentRoute>
      <div className="row">
        {/* {JSON.stringify(completedLessons)} */}
        <div style={{ maxWidth: 320 }}>
          <Button
            onClick={() => setCollapsed(!collapsed)}
            className="text-primary mt-1 btn-block mb-2"
            disabled={onlyWidth < 800}
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
            {!collapsed && "Lessons"}
          </Button>

          {/* how many completed */}
          {!collapsed && course && (
            <div className="pt-2" style={{ borderBottom: "3px solid #222" }}>
              <PieChartOutlined className="pl-4 pr-1 h4" />{" "}
              <span className="text-success">{completedLessons.length}</span>
              {" / "}
              <span className="text-danger">{course.lessons.length}</span>{" "}
              lessons completed
            </div>
          )}

          <Menu
            mode="inline"
            defaultSelectedKeys={[clicked]}
            inlineCollapsed={collapsed}
            // style={{
            //   height: "100vh",
            //   overflow: "scroll",
            // }}
          >
            {course.lessons.map((lesson, index) => (
              <Item
                onClick={() => setClicked(index)}
                key={index}
                icon={
                  <Avatar>
                    <span>{index + 1}</span>
                  </Avatar>
                }
              >
                {lesson.title.substring(0, 30)}

                {completedLessons.includes(lesson._id) ? (
                  <CheckCircleFilled
                    className="float-right text-primary ml-2"
                    style={{ marginTop: "13px" }}
                  />
                ) : (
                  <MinusCircleFilled
                    className="float-right text-danger ml-2"
                    style={{ marginTop: "13px" }}
                  />
                )}
              </Item>
            ))}
          </Menu>
        </div>
        {/* right content area */}
        <div
          className="col pt-2"
          // style={{
          //   height: "100vh",
          //   overflow: "scroll",
          // }}
        >
          {clicked !== -1 ? (
            <>
              <div className="col alert alert-primary square">
                <b>{course.name.substring(0, 30)}</b> /{" "}
                {course.lessons[clicked].title.substring(0, 30)}
                {/* conditional rendering */}
                {completedLessons.includes(course.lessons[clicked]._id) ? (
                  <span
                    className="float-right pointer"
                    onClick={markIncomplete}
                  >
                    Mark incomplete
                  </span>
                ) : (
                  <span className="float-right pointer" onClick={markCompleted}>
                    Mark as completed
                  </span>
                )}
              </div>

              <div>
                {course.lessons[clicked].video &&
                  course.lessons[clicked].video.Location && (
                    <>
                      <div className="wrapper">
                        <ReactPlayer
                          className="player"
                          // playing
                          // light="/images/default/player.png"
                          url={course.lessons[clicked].video.Location}
                          width="100%"
                          height="100%"
                          controls
                        />
                      </div>
                      <hr />
                    </>
                  )}

                <ReactMarkdown
                  source={course.lessons[clicked].content}
                  renderers={{ code: CodeBlock }}
                  className="single-post"
                />

                {/* qa */}
                <br />
                {clicked !== -1 && (
                  <QaCreateRead
                    visible={visible}
                    setVisible={setVisible}
                    values={values}
                    setValues={setValues}
                    handleCreatePost={handleCreatePost}
                    clickedLessonQa={clickedLessonQa}
                    handleQaDelete={handleQaDelete}
                    handleQaEdit={handleQaEdit}
                    handleAddAnswer={handleAddAnswer}
                    handleEditAnswer={handleEditAnswer}
                    handleDeleteAnswer={handleDeleteAnswer}
                    markdownCheetsheetModal={markdownCheetsheetModal}
                    setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
                    markQaAsResolved={markQaAsResolved}
                    markQaAsNotResolved={markQaAsNotResolved}
                  />
                )}
                {/* edit in modal view */}
                <QaEdit
                  editModalVisible={editModalVisible}
                  setEditModalVisible={setEditModalVisible}
                  editValues={editValues}
                  setEditValues={setEditValues}
                  handleEditPost={handleEditPost}
                  answerLoading={answerLoading}
                  markdownCheetsheetModal={markdownCheetsheetModal}
                  setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
                />
                {/* add answer */}
                <AddAnswer
                  answerModalVisible={answerModalVisible}
                  setAnswerModalVisible={setAnswerModalVisible}
                  answerContent={answerContent}
                  setAnswerContent={setAnswerContent}
                  handleAnswerPost={handleAnswerPost}
                  answerLoading={answerLoading}
                  setAnswerLoading={setAnswerLoading}
                  currentQuestion={currentQuestion}
                  markdownCheetsheetModal={markdownCheetsheetModal}
                  setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
                />
                {/* edit answer */}
                <EditAnswer
                  answerEditModalVisible={answerEditModalVisible}
                  setAnswerEditModalVisible={setAnswerEditModalVisible}
                  handleEditAnswerPost={handleEditAnswerPost}
                  answerEditLoading={answerEditLoading}
                  setAnswerEditLoading={setAnswerEditLoading}
                  currentAnswer={currentAnswer}
                  setCurrentAnswer={setCurrentAnswer}
                  markdownCheetsheetModal={markdownCheetsheetModal}
                  setMarkdownCheetsheetModal={setMarkdownCheetsheetModal}
                />
              </div>
              <br />
            </>
          ) : (
            <div className="d-flex justify-content-center p-5">
              <div className="text-center p-5">
                {/* <div className="pt-5"></div> */}
                <PlayCircleOutlined className="text-primary display-1 p-5" />
                <h2>Start Learning</h2>
                <p className="lead">
                  Click the lessons on the sidebar to start.
                </p>
              </div>
            </div>
          )}
        </div>

        <br />
        <br />
      </div>
    </StudentRoute>
  );
};

export default SingleCourse;
