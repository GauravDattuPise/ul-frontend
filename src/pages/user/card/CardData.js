import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Box, Button, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';


const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export default function CardData({ name, email, phone, userId }) {

    const {token} = JSON.parse(localStorage.getItem("userData"))

    const navigate = useNavigate();

    function handleEditBlog() {
        // sending userId to user edit page via params
        localStorage.setItem("userId", userId)
        navigate(`/updateUser/${userId}`);
    }

    // deleting user using userId
    async function handleDelete() {
        try {

            const confirmDelete = window.confirm("Are you sure you want to delete this user?");
            if (confirmDelete) {
                try {
                    const { data } = await axios.delete(`http://ec2-51-20-105-133.eu-north-1.compute.amazonaws.com:5000/user/deleteUser/${userId}`,{
                        headers : {
                            "Content-Type" : "application/json",
                            "Authorization" : `Bearer ${token}`
                        }
                    });

                    if (data?.status) {
                        toast.success(data?.message);

                        // forcefully refreshing tab to show user is deleted.
                        window.location.reload();
                    }
                } catch (error) {
                    toast.error("Error in Delete");
                    console.log("error in user delete", error);
                }
            }
        } catch (error) {
            toast.error("Error in Delete");
            console.log("error in user delete", error)
        }
    }

    return (

        <Card className='card-details' sx={{ width: "30%", margin: "auto", mt: 2, boxShadow: "5px 5px 10px #ccc" }}>

            {/* card title & description */}
            <CardContent sx={{ display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: 'center' }}>

                <Typography variant="h6" color="text.primary">
                    User Name : {name}
                </Typography>

                <Typography variant="h6" color="text.primary">
                    email : {email}
                </Typography>

                <Typography variant="h6" color="text.primary">
                    phone : {phone}
                </Typography>

                <Toolbar>
                    <Button variant='contained' color='warning' onClick={handleEditBlog}>Update</Button>
                    <Button sx={{marginLeft : "100px"}} variant='contained' color='error' onClick={handleDelete}>Delete</Button>
                </Toolbar>
            </CardContent>

        </Card>
    );
}
