import { useEffect, useState } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import Link from "next/link";
import { Avatar, Badge } from "antd";
import { CloseCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    // console.log(data);
    setCourses(data);
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square p-3 mt-2 left-bottom-radius">
        Courses
      </h1>

      {!courses.length && (
        <Link href="/instructor/course/create">
          <a className="btn btn-primary float-right mt-2">Create course</a>
        </Link>
      )}
      {courses &&
        courses.map((course) => (
          <div className="media pb-3" key={course._id}>
            <Avatar
              size={80}
              src={course.image ? course.image.Location : "/course.png"}
            />
            <div className="media-body pl-2">
              <div className="row">
                <div className="col">
                  <Badge count={course.paid ? course.price : "Free"}>
                    <Link
                      href={`/instructor/course/view/${course.slug}`}
                      className="pointer"
                    >
                      <a>
                        <h5 className="mt-2 text-primary">{course.name}</h5>
                      </a>
                    </Link>
                  </Badge>
                  <p style={{ marginTop: "-10px" }}>
                    {course.lessons.length} Lessons
                  </p>

                  {course.lessons.length < 5 ? (
                    <p
                      style={{ marginTop: "-15px", fontSize: "10px" }}
                      className="text-warning"
                    >
                      At least 5 lessons are required to publish a course
                    </p>
                  ) : course.published ? (
                    <p
                      style={{ marginTop: "-15px", fontSize: "10px" }}
                      className="text-success"
                    >
                      Your course is live in the marketplace
                    </p>
                  ) : (
                    <p
                      style={{ marginTop: "-15px", fontSize: "10px" }}
                      className="text-success"
                    >
                      Your course is ready to be published
                    </p>
                  )}
                </div>
                <div className="mt-3 float-right pr-4 text-center">
                  {course.published ? (
                    <div>
                      <CheckCircleOutlined className="h5 pointer text-success" />
                      <br />
                      <small className="text-muted">Published</small>
                    </div>
                  ) : (
                    <div>
                      <CloseCircleOutlined className="h5 pointer text-warning" />
                      <br />
                      <small className="text-muted">Unpublished</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </InstructorRoute>
  );
};

export default InstructorIndex;
