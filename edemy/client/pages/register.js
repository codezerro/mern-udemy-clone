import React, { useState } from "react";
import styles from "../styles/Home.module.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("hello ");
        console.table({ name, email, password });
    };

    return (
        <>
            <h1
                className={`${styles.jumbotron} ${styles.squre} bg-primary text-center`}
            >
                Register
            </h1>

            <div className='container col-md-4 offset-md-4 pb-5'>
                <form onSubmit={handleSubmit}>
                    <input
                        type='text'
                        className='form-control mb-4 p-4'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder='Enter Name'
                        required
                    />
                    <input
                        type='email'
                        className='form-control mb-4 p-4'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder='Enter Email'
                        required
                    />
                    <input
                        type='password'
                        className='form-control mb-4 p-4'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder='Enter Password'
                        required
                    />
                    <br />
                    <button
                        type='submit'
                        className='btn btn-block btn-primary p-2'
                    >
                        Submit
                    </button>
                </form>
            </div>
        </>
    );
}

export default Register;
