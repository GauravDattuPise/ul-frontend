import { Box, Button, InputAdornment, TextField, Typography } from '@mui/material'
import React, { useContext, useState } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"

import "./Login.css"

// icons for password
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Header from '../../../layout/Header'
import { GlobalLoginState } from '../../../App'

const Login = () => {

    const {loginStateHandle} = useContext(GlobalLoginState)
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    // state for inputs
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });

    // handling input 
    function handleInputChange(e) {
        setInputs((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value
        }))
    }

    // user registration
    async function handleLogin(e) {

        e.preventDefault();

        try {
            const adminObj = {
                email: inputs.email,
                password: inputs.password
            }

            // sending data to backend
            const res = await axios.post("http://ec2-51-20-105-133.eu-north-1.compute.amazonaws.com:5000/admin/login", adminObj)

            let expiryTime = new Date();
           expiryTime.setMinutes(expiryTime.getMinutes() + 50)

           const userDetails = {expiration : expiryTime.toISOString(), token : res.data.token}

            // toast message
            if (res.data.status) {
                toast.success(res.data.message)
                const userData = JSON.stringify(userDetails)
                localStorage.setItem("userData", userData);
                loginStateHandle(true);
                setTimeout(()=>{
                    navigate("/addUser")
                },1000)
            }
            else {
                toast.error(res.data.message)
            }

        } catch (error) {
            toast.error("Something went wrong")
            console.log(error)
        }
    }

    return (
        <div className='login_container' >
            <Header />
            <form onSubmit={handleLogin} style={{
                display: "flex", 
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: "400px",
                width : "500px",
                border : "2px solid green",
                background : "white"
            }} >
                    <Typography variant='h4' color='textSecondary'>Login</Typography>

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
                        sx={{width : "300px"}}
                    />
                    <TextField
                        variant='outlined'
                        label="Password"
                        type={showPassword ? "text" : "password"}
                        name='password'
                        margin='normal'
                        value={inputs.password}
                        onChange={handleInputChange}
                        required
                        className="form-field"
                        sx={{width : "300px"}}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position='end'>
                                    <Button onClick={() => setShowPassword((prevState) => !prevState)}>
                                        {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                    </Button>
                                </InputAdornment>
                            )
                        }}
                    />

                    <Button 
                    type='submit'
                     variant='contained' 
                     sx={{width : "200px", marginTop : "20px"}}
                     >Login</Button>

                    {/* button for navigate to login */}
                    <Button 
                    sx={{textTransform : "capitalize", textDecoration : "underline", marginTop : "10px"}}
                    onClick={() => navigate("/register")} >
                        Not a user ? Please Register
                    </Button>
            </form>
        </div>
    )
}

export default Login