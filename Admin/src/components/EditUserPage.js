import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography, useMediaQuery } from "@mui/material";
import Header from "./Header";
import axios from 'axios';
import { fetchUserDataById } from '../components/api';

export const EditUserPage = () => {
  const { userId } = useParams();
  const [userToEdit, setUserToEdit] = useState();
  const isNonMobile = useMediaQuery("(min-width: 300px)")

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await fetchUserDataById(userId); // Replace with your API call to fetch user data by ID
        setUserToEdit(userData.data);
        console.log(userData)
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, [userId]);


  const [majors, setMajors] = useState([]); // State to hold fetched majors

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/majors'); // Replace with your API endpoint
        setMajors(response.data.data);
        console.log(response.data.data);
        // Assuming the response contains an array of majors
      } catch (error) {
        console.error('Error fetching majors:', error);
        // Handle error state or display a message to the user
      }
    };

    fetchMajors(); // Call the function to fetch majors when the component mounts
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserToEdit((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };


  const handleSaveChanges = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userToEdit),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      alert('Cập nhật người dùng thành công!');
      window.location.href = '/list';
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  return (
    <Box m="20px">
      <Box display={"flex"} justifyContent="space-between" alignItems="center">
        <Header title="Cập Nhật Thông Tin" subtitle="Cập nhật hồ sơ người dùng mới" />

      </Box>
      {userToEdit && (
        <Box display="grid" gap="20px" gridTemplateColumns="repeat(1, minmax(0, 0.6fr))"
          sx={{
            "& > div": { gridColumn: isNonMobile ? undefined : "span 1" },
            margin: "70px 70px 0 400px"
          }}>
          <TextField
            label="Họ và tên"
            name="fullname"
            value={userToEdit.fullname || ''}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ gridColumn: "span 1" }}
          />
          <TextField
            label="Email"
            name="email"
            value={userToEdit.email || ''}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ gridColumn: "span 1" }}
          />
          {/* <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={userToEdit.password || ''}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
            sx={{ gridColumn: "span 1" }}
          /> */}
          {/* Uncomment this section if username field is needed */}
          {/* <TextField
            label="Tài khoản"
            name="username"
            value={userToEdit.username || ''}
            onChange={handleInputChange}
            fullWidth
            variant="outlined"
          /> */}
          <FormControl fullWidth variant="outlined">
            <InputLabel id="major-select-label">Chuyên ngành</InputLabel>
            <Select
              labelId="major-select-label"
              id="major-select"
              value={userToEdit.major_id || ''}
              name="major_id"
              onChange={handleInputChange}
              sx={{ gridColumn: "span 1" }}

            >
              {majors.map((major) => (
                <MenuItem key={major.id} value={major.id}>
                  {major.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSaveChanges}
            fullWidth
            sx={{ gridColumn: "span 1" }}
          >
            Lưu Thay Đổi
          </Button>
        </Box>
      )}
    </Box>
  );
};
