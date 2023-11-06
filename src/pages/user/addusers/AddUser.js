import { Box, Button, Grid, TextField, Toolbar, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { json, useNavigate } from 'react-router-dom';
import Header from '../../../layout/Header';

import "./AddUser.css"

// adding user

const AddUser = () => {

    const navigate = useNavigate();

    // state
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        phone: ""
    });

    // error messages
    const [nameError, setNameError] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [emailError, setEmailError] = useState("");

    // Validation function
    const validateInputs = () => {
        let isValid = true;

        if ((inputs.name.trim().length < 3 && inputs.name.length !== 0) || (inputs.name.length !== 0 && !inputs.name.match(/^[a-zA-Z\s]+$/))) {
            setNameError('Name should have atleast 3 alphabets');
            isValid = false;
        } else {
            setNameError('');
        }

        if (!inputs.email.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/) && inputs.email.length !== 0) {
            setEmailError('Invalid email');
            isValid = false;
        } else {
            setEmailError('');
        }

        if ((inputs.phone.trim().length !== 10 && inputs.phone.length !== 0) || (inputs.phone.length !== 0 && !inputs.phone.match(/^\d{10}$/))) {
            setPhoneError("Phone no. should have 10 digits only")
            isValid = false
        } else {
            setPhoneError("")
        }
        return isValid;

    };

    // getting from localstorage 
    const {token} = JSON.parse(localStorage.getItem("userData"))

    // updating state
    function handleInputChange(e) {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    // sending user data
    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const userData = {
                name: inputs.name,
                email: inputs.email,
                phone: inputs.phone,
            }

            const { data } = await axios.post("user/addUser", userData,{
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}`
                }
            });

            if (data.status) {
                toast.success(data.message)

                setTimeout(() => {
                    navigate("/getAllUsers")
                }, 1000)
            }
            else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("Error in adding user")
            console.log(error);
        }
    }

    useEffect(() => {
        validateInputs();
    }, [inputs])
    return (
        <div>
            <Header />
            <Grid container justifyContent="center" alignItems="center" height="600px">
                <form onSubmit={handleSubmit}>
                    <Box className="container"
                        sx={{ height: "400px", width: "500px", marginTop: "200px", background: "white", display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center" }}
                    >
                        <Typography sx={{ color: "red", fontSize: "30px" }}>Add User</Typography>

                        <TextField
                            variant='outlined'
                            label="User Name"
                            type="text"
                            name='name'
                            margin='normal'
                            value={inputs.name}
                            onChange={handleInputChange}
                            required
                            className="form-field"
                        />
                        {nameError !== "" && <p className='error'>{nameError}</p>}

                        <TextField
                            variant='outlined'
                            label="Email"
                            type="email"
                            name='email'
                            margin='normal'
                            value={inputs.email}
                            onChange={handleInputChange}
                            required
                            className="form-field"
                        />
                        {emailError !== "" && <p className='error'>{emailError}</p>}

                        <TextField
                            variant='outlined'
                            label="Phone"
                            name='phone'
                            margin='normal'
                            value={inputs.phone}
                            onChange={handleInputChange}
                            required
                            className="form-field"
                        />
                        {phoneError !== "" && <p className='error'>{phoneError}</p>}

                        <Toolbar>
                            <Button type='submit' sx={{ width: "160px" }} variant='contained' className="submit-button">add User</Button>
                            <Button variant='contained' color='error' sx={{ marginLeft: "80px" }} onClick={() => navigate("/getUser")}>Cancel</Button>
                        </Toolbar>
                    </Box>
                </form>
            </Grid>
        </div>
    )
}

export default AddUser