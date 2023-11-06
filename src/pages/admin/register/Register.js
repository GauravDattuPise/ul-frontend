import { Autocomplete, Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField, Toolbar, Typography } from '@mui/material'
import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { toast } from "react-hot-toast"
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import "./Register.css"
import Header from '../../../layout/Header'

const Register = () => {

  // state for inputs
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    city: "",
  });

  console.log(inputs.state)
  // handling input 
  function handleInputChange(e) {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  }
  //---------------------------------------------------------------------------------

  const [showPassword, setShowPassword] = useState(false);

  // states for error handling messages
  const [howDidYouHearAboutThis, setHowDidYouHearAboutThis] = useState([]);
  const [howDidYouHearAboutThisMessage, setHowDidYouHearAboutThisMessage] = useState("");

  // ================= handling howDidYouHearAboutThis ===============================

  const handleHowDidYouHearAboutThis = (e) => {
    let newArray = howDidYouHearAboutThis;
    let index = newArray.indexOf(e.target.value)
    if (index === -1) {
      newArray.push(e.target.value);
      setHowDidYouHearAboutThis(newArray)
    }
    else {
      newArray.splice(index, 1);
      setHowDidYouHearAboutThis(newArray)
    }

    console.log(howDidYouHearAboutThis);
    if (howDidYouHearAboutThis.length !== 0) {
      setHowDidYouHearAboutThisMessage("")
    }
  }
  const navigate = useNavigate();

  // error messages
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [cityError, setCityError] = useState("");
  const [genderError, setGenderError] = useState("")

  // Validation function
  const validateInputs = () => {
    let isValid = true;

    if ((inputs.name.trim().length < 3 && inputs.name.length !== 0) || (inputs.name.length !== 0 && !inputs.name.match(/^[a-zA-Z\s]+$/))) {
      setNameError('Name should have atleast 3 alphabets');
      console.log(inputs.name)
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

    if (!inputs.password.match(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/) && inputs.password.length !== 0) {
      setPasswordError('Password should be strong, eg.Pass@123');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if ((inputs.phone.trim().length !== 10 && inputs.phone.length !== 0) || (inputs.phone.length !== 0 && !inputs.phone.match(/^\d{10}$/))) {
      setPhoneError("Phone no. should have 10 digits only")
      isValid = false
    } else {
      setPhoneError("")
    }

    if (inputs.city !== "") {
      setCityError("")
    }

    return isValid;
  };


  async function handleRegister(e) {

    e.preventDefault();

    if (inputs.city === "") {
      setCityError("Please select city");
      return;
    }
    if (inputs.gender === "") {
      setGenderError("Choose your gender");
      return
    }
    if (howDidYouHearAboutThis.length === 0) {
      setHowDidYouHearAboutThisMessage("Please choose any of the above option");
      return;
    }

    try {
      const adminObj = {
        name: inputs.name,
        email: inputs.email,
        password: inputs.password,
        phone: inputs.phone,
        gender: inputs.gender,
        howDidYouHearAboutThis: howDidYouHearAboutThis,
        city: inputs.city,
        state: inputs.state
      }

      // sending user's data to backend
      const res = await axios.post("/admin/register", adminObj)

      // toast message
      if (res.data.status) {
        toast.success(res.data.message);
        navigate("/")
      }
      // if email is already exists
      else {
        toast.error(res.data.message)
      }

    } catch (error) {
      toast.error("Error in Registration")
      console.log(error)
    }
  }

  // for validating inputs
  useEffect(() => {
    validateInputs();
  }, [inputs])


  return (
    <div>
      <Header />
      <div className='parent_container'>
        <form className='container' style={{display : "flex", flexDirection : "column", justifyContent : "center", alignItems : "center", width : "600px"}} onSubmit={handleRegister}>
          <h1 className='register_header'>Register</h1>
          <TextField
            className='text_field'
            placeholder='Your Name'
            name='name'
            value={inputs.name}
            type='text'
            onChange={handleInputChange}
            required
          />
          {nameError !== '' && <p className="error">{nameError}</p>}

          <TextField
            className='text_field'
            placeholder='Your Email'
            name='email'
            value={inputs.email}
            type='email'
            onChange={handleInputChange}
            required
          />
          {emailError !== '' && <p className='error'>{emailError}</p>}

          <TextField
            className='text_field'
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            name='password'
            value={inputs.password}
            required
            onChange={handleInputChange}
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
          {passwordError !== "" && <p className='error'>{passwordError}</p>}

          <TextField
            className='text_field'
            placeholder="Phone"
            name='phone'
            value={inputs.phone}
            type='Number'
            onChange={handleInputChange}
            required
          />
          {phoneError !== "" && <p className='error'>{phoneError}</p>}

          {/* city  */}
          <FormControl   >
            <Toolbar>
              <h2>Select City &nbsp;&nbsp;&nbsp;</h2>
              <Select
                sx={{ marginTop: "10px", width: "280px" }}
                placeholder='Select City'
                name="city"
                value={inputs.city}
                onChange={handleInputChange}
              >
                <MenuItem value="Mumbai">Mumbai</MenuItem>
                <MenuItem value="Pune">Pune</MenuItem>
                <MenuItem value="Ahemadabad">Ahemadabad</MenuItem>
              </Select>
            </Toolbar>
          </FormControl>
          {inputs.city === "" && <p className='error'>{cityError}</p>}


          {/* gender  */}
          <Toolbar>
            <FormControl sx={{ marginTop: "15px" }}>
              <RadioGroup
                name="gender"
                value={inputs.gender}
                onChange={handleInputChange}
                className='decrease_mt'
              >
                <Toolbar>
                  <h2>Your Gender &nbsp; &nbsp;&nbsp;&nbsp;</h2>
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Other" control={<Radio />} label="Other" />
                </Toolbar>
              </RadioGroup>
            </FormControl>
          </Toolbar>
          {inputs.gender === "" && <p style={{ marginTop: "-17px" }} className='error'>{genderError}</p>}

          {/* how did you hear about this */}
          <FormGroup className='decrease_mt'>
            <h2>How did you hear about us!</h2>
            <Toolbar className='decrease_mt'>
              <FormLabel>LinkedIn</FormLabel>
              <Checkbox value="LinkedIn" onChange={(e) => { handleHowDidYouHearAboutThis(e) }}></Checkbox>
              <FormLabel>Friends</FormLabel>
              <Checkbox value="Friends" onChange={(e) => { handleHowDidYouHearAboutThis(e) }}></Checkbox>
              <FormLabel>Job Portal</FormLabel>
              <Checkbox value="Job Portal" onChange={(e) => { handleHowDidYouHearAboutThis(e) }}></Checkbox>
              <FormLabel>Others</FormLabel>
              <Checkbox value="Others" onChange={(e) => { handleHowDidYouHearAboutThis(e) }}></Checkbox>
            </Toolbar>
          </FormGroup>
          {howDidYouHearAboutThisMessage !== "" && <p className='error'>{howDidYouHearAboutThisMessage}</p>}

          <Button type='submit' className='btn' variant='contained' size='large'>Register</Button>
          <Button className='link_btn' onClick={()=>navigate("/")}>Already a User, Login Here!</Button>

        </form>
      </div>
    </div >
  )
}

export default Register