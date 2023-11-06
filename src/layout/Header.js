

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { toast } from 'react-hot-toast';
import { GlobalLoginState } from '../App';

const Header = () => {
    const { isLogin, loginStateHandle } = useContext(GlobalLoginState);
    const navigate = useNavigate();

    function handleLogout() {
        loginStateHandle(false);
        localStorage.removeItem('userData');
        navigate('/');
    }

    return (
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant='h5'>Manage Users</Typography>
                    <Box sx={{ marginLeft: 'auto', marginRight: '10px' }}>
                        {isLogin && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant='contained' color='primary' onClick={() => navigate('/addUser')}>
                                    Add User
                                </Button>
                                <Button variant='contained' color='primary' onClick={() => navigate('/getAllUsers')}>
                                    Users
                                </Button>
                                <Button variant='contained' color='error' onClick={handleLogout}>
                                    Logout
                                </Button>
                            </Box>
                        )}
                        {!isLogin && (
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button variant='contained' color='primary' onClick={() => navigate('/register')}>
                                    Register
                                </Button>
                                <Button variant='contained' color='primary' onClick={() => navigate('/')}>
                                    Login
                                </Button>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );
};

export default Header;
