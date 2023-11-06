

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import CardData from '../card/CardData';
import Header from '../../../layout/Header';
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const GetUsers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [byName, setByName] = useState('');
    const [byEmail, setByEmail] = useState('');
    const [byPhone, setByPhone] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [selectedValue, setSelectedValue] = useState("")

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name === 'name') {
            setByName(value);
        } else if (name === 'email') {
            setByEmail(value);
        } else if (name === 'phone') {
            setByPhone(value);
        }
    };

    const handleSortChange = (e) => {
        setSelectedValue(e.target.value);
    };

    // state for users
    const [users, setUsers] = useState([]);
    const { token } = JSON.parse(localStorage.getItem('userData'));

    // function for fetching users from the backend and assign to users state
    async function getAllUsers() {
        try {
            const { data } = await axios.get('http://ec2-51-20-127-56.eu-north-1.compute.amazonaws.com:5000/user/getUsersDetails', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (data?.status) {
                setUsers(data.userDetails);
                setIsLoading(false)
            }
        } catch (error) {
            console.log('error in get all users', error);
        }
    }

    // get all users at the time of rendering
    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        // filtering users based on the search value
        const filtered = users.filter((user) => {
            const nameMatch = !byName || user.name.toLowerCase().includes(byName.toLowerCase());
            const emailMatch = !byEmail || user.email.toLowerCase().includes(byEmail.toLowerCase());
            const phoneMatch = !byPhone || user.phone.includes(byPhone);

            return nameMatch && emailMatch && phoneMatch;
        });

        if (selectedValue === 'lastInserted') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (selectedValue === 'lastUpdated') {
            filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }

        setFilteredUsers(filtered);
    }, [byName, byEmail, byPhone, users, selectedValue]);

    return (
        <div>
            <Header />
            {
                isLoading && <CircularProgress />
            }
            <div style={{ marginTop: '70px', position: 'relative', justifyContent: 'center', alignItems: 'center', marginLeft: '500px' }}>
                <TextField
                    name="name"
                    label="Search by Name"
                    value={byName}
                    sx={{ background: 'white' }}
                    onChange={handleInputChange}
                />
                <TextField
                    name="email"
                    value={byEmail}
                    label="Search by Email"
                    sx={{ background: 'white' }}
                    onChange={handleInputChange}
                />
                <TextField
                    name="phone"
                    value={byPhone}
                    label="Search by Phone"
                    sx={{ background: 'white' }}
                    onChange={handleInputChange}
                />

                <FormControl>
                    <InputLabel htmlFor="sort-by">Sort By</InputLabel>
                    <Select
                        label="Sort By"
                        value={selectedValue}
                        onChange={handleSortChange}
                        inputProps={{
                            id: 'sort-by',
                        }}
                        sx={{ width: '200px', background: 'white'}}
                    >
                        <MenuItem value="lastInserted">Last Inserted</MenuItem>
                        <MenuItem value="lastUpdated">Last Updated</MenuItem>
                    </Select>
                </FormControl>


            </div>
            <div>
                {/* showing the filtered users */}
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user._id}>
                            <CardData name={user.name} email={user.email} phone={user.phone} userId={user._id} />
                        </div>
                    ))
                ) : (
                    <img style={{ height: "400px", width: '600px', display: "flex", justifyContent: "center", alignItems: "center", marginLeft: "500px", marginTop: "100px" }} className="image-design" src="https://cdn.dribbble.com/users/1190995/screenshots/3307869/dribbble.png" alt="No data found image" />
                )}
            </div>
        </div>
    );
};

export default GetUsers;
