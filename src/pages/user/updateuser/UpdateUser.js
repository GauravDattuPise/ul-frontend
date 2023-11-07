import { Box, Button, Grid, TextField, Toolbar, Typography } from '@mui/material'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../../layout/Header';

import "./UpdateUser.css"

// updating user

const UpdateUser = () => {

    // getting id from params
    const userId = useParams().userId;
    const {token} = JSON.parse(localStorage.getItem("userData"))

    const navigate = useNavigate();

    // state for inputs
    const [inputs, setInputs] = useState({
        name: "",
        email: "",
        phone: ""
    });

    // updating state

    function handleInputChange(e) {
        const { name, value } = e.target;
        setInputs((prevInputs) => ({
            ...prevInputs,
            [name]: value
        }));
    }

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
    
    // getting single user & setting inputs
    async function getUser() {
        try {
                
            const { data } = await axios.get(`http://ec2-51-20-105-133.eu-north-1.compute.amazonaws.com:5000/user/getSingleUser/${userId}`,{
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}`
                }
            });

            if (data?.status === true) {
                const { name, email, phone } = data.user;
                setInputs({ name, email, phone });
            }

        } catch (error) {
            toast.error("error in getting sigle user")
            console.log("error in get single user", error);
        }
    }

    useEffect(() => {
        getUser();
    }, [userId]);



    // updating user
    async function handleEditUser(e) {
        e.preventDefault();

        try {
            const { data } = await axios.put(`http://ec2-51-20-105-133.eu-north-1.compute.amazonaws.com:5000/user/updateUser/${userId}`, inputs,{
                headers : {
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}` 
                }
            });

            if (data?.status) {
                toast.success(data?.message);
                 navigate("/getAllUsers");
            }

        } catch (error) {
            toast.error("Error in update user");
            console.log("error in update user", error);
        }
    }

    useEffect(()=>{
         validateInputs();
    },[inputs])


    return (
        <div>
            <Header />
            
            <Grid container justifyContent="center" alignItems="center" height="100vh">
                <form onSubmit={handleEditUser}>
                    <Box className="update_container">
                        <Typography className="form-title" variant='h4' color='textSecondary'>update User</Typography>

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
                            type="number"
                            name='phone'
                            margin='normal'
                            value={inputs.phone}
                            onChange={handleInputChange}
                            required
                            className="form-field"
                        />
                        {phoneError !== "" && <p className='error'>{phoneError}</p>}


                        <Toolbar>
                            <Button type='submit' sx={{ width: "160px" }} variant='contained' className="submit-button">Update User</Button>
                            <Button variant='contained' color='error' sx={{ marginLeft: "80px" }} onClick={()=>navigate("/getUser")}>Cancel</Button>
                        </Toolbar>
                    </Box>
                </form>
            </Grid>
        </div>
    )
}

export default UpdateUser