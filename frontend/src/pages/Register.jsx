import React, {useState, useffect} from 'react';
import styled from 'styled-components'
import {Link} from 'react-router-dom'
import axios from 'axios';
import {ToastContainer,toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Logo from "../assets/logo.png";
import { registerRoute } from '../utils/APIRoutes';

function Register() {
    const [values, setValues] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark", 
       };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (handleValidation()) {
            const {password,confirmPassword,username,email} = values;
              const {data} = await axios.post(registerRoute, {
                username,
                email,
                password,
              } );
        };
    };

    const handleValidation =()=> {
        const {password,confirmPassword,username,email} = values;
        if(password !== confirmPassword) {
            console.log(toast)
           toast.error("password and confirm password should match", toastOptions);
           return false;
        } else if (username.length< 3 && username.length > 20) {
            toast.error("username should be between 3 to 20 characters long", toastOptions);
           return false;
        }
        else if (password.length < 5) {
            toast.error("Password should be more than 5 characters long", toastOptions);
           return false;
        }
        else if (email === "") {
            toast.error("Email is required", toastOptions);
           return false;
        }
        return true;
    }

    const handleChange = (event) => {
        setValues({...values, [event.target.name]: event.target.value});
    }
    return <>
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className="brand">
                <img src={Logo} alt="Logo" />
                <h1>chatEase</h1>
            </div>
            <input type="text" placeholder="Username" name = "username" onChange={e=>handleChange(e)}/>
            <input type="email" placeholder="Email" name = "email" onChange={e=>handleChange(e)}/>
            <input type="password" placeholder="Password" name = "password" onChange={e=>handleChange(e)}/>
            <input type="password" placeholder="Confirm Password" name = "confirmPassword" onChange={e=>handleChange(e)}/>
            <button type="submit">Register</button>
            <span>Already have an account? <Link to ="/login">Login</Link></span>
        </form>
    </FormContainer>
    <ToastContainer>

    </ToastContainer>
    </>
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #195827;
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: none;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: white;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: black;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #33b249;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: red;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;
export default Register;