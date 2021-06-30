import Head from "next/head";
import Link from "next/link";

const Error = () => {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="/css/404.css" />
      </Head>

      <div className="container-fluid overflow-hidden">
        <div className="row">
          <div className="col-md-12">
            <div id="clouds">
              <div className="cloud x1"></div>
              <div className="cloud x1_5"></div>
              <div className="cloud x2"></div>
              <div className="cloud x3"></div>
              <div className="cloud x4"></div>
              <div className="cloud x5"></div>
            </div>
            <div className="c">
              <div className="_404">404</div>
              <br />
              <br />
              <div className="_1">THE PAGE</div>
              <br />

              <div className="_2">IS NOT FOUND</div>
              <br />
              <Link href="/">
                <a className="btn btn-lg btn-primary">Go Back Home</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Error;
