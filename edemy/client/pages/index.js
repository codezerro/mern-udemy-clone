import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
    return (
        <>
            <h1
                className={`${styles.jumbotron} ${styles.square} text-center bg-primary  text-warning`}
            >
                Hello this is next js project
            </h1>
        </>
    );
}
