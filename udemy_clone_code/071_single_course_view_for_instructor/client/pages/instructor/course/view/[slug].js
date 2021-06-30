import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";

const CourseView = () => {
  const [course, setCourse] = useState({});

  const router = useRouter();
  const { slug } = router.query;

  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    const { data } = await axios.get(`/api/course/${slug}`);
    setCourse(data);
  };

  return (
    <InstructorRoute>
      <div className="contianer-fluid pt-3">
        <pre>{JSON.stringify(course, null, 4)}</pre>
      </div>
    </InstructorRoute>
  );
};

export default CourseView;
