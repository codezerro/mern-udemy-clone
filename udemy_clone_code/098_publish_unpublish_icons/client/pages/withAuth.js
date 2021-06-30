import axios from "axios";

export default function withAuth(Component) {
  const withAuth = (props) => {
    return <Component {...props} />;
  };

  withAuth.getServerSideProps = async (ctx) => {
    try {
      const { data } = await axios.get(`/api/current-user`);
      console.log("data ===> ", data);
      if (data)
        return {
          props: {
            ok: true,
          },
        };
    } catch (err) {
      console.log(err);
      // return { props: { ok: false } };
      return {
        redirect: {
          permanent: false,
          destination: "/login",
        },
        props: {},
      };
    }
  };

  return withAuth;
}
