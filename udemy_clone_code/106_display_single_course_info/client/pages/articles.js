import { withRouter } from "next/router";
import axios from "axios";
import PostCard from "../components/cards/PostCard";
import Head from "next/head";

const Articles = ({ posts, router }) => {
  const head = () => (
    <Head>
      <title>
        Articles on JavaScript React Next.js Node MongoDB GraphQL SEO MERN |{" "}
        {process.env.APP_NAME}
      </title>
      <meta
        name="description"
        content="Articles on Modern JavaScript React Next.js Node MongoDB GraphQL SEO MERN Full Stack Web Development Courses Free and Paid"
      />
      <link rel="canonical" href={`${process.env.DOMAIN}${router.pathname}`} />
      <meta
        property="og:title"
        content={`Articles on JavaScript React Next.js Node MongoDB GraphQL SEO MERN | ${process.env.APP_NAME}`}
      />
      <meta
        property="og:description"
        content={`Articles on JavaScript React Next.js Node MongoDB GraphQL SEO MERN Full Stack Web
            Development Courses | Free and Paid | ${process.env.APP_NAME}`}
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${process.env.DOMAIN}/default.jpg`} />
      <meta property="og:site_name" content={process.env.APP_NAME} />
      <meta property="og:image" content={`${process.env.DOMAIN}/default.jpg`} />
      <meta
        property="og:image:secure_url"
        content={`${process.env.DOMAIN}/default.jpg`}
      />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FB_APP_ID} />
    </Head>
  );

  return (
    <>
      {head()}
      {/* <h1 className="jumbotron text-center bg-primary square">
        Online Education Marketplace
      </h1> */}
      <div className="container-fluid">
        <div className="row pt-2">
          {posts.map((post) => (
            <div key={post._id} className="col-md-4">
              <PostCard post={post} />
              {/* <pre>{JSON.stringify(post, null, 4)}</pre> */}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export async function getServerSideProps() {
  const { data } = await axios.get(`${process.env.API}/posts`);
  // console.log("DATA LENGTH =====> ", data.length);
  return {
    props: {
      posts: data,
    },
  };
}

export default withRouter(Articles);
