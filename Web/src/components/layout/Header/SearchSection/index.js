import { Box, Divider, IconButton, InputBase, Paper } from "@mui/material";
import React, { useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNavigate } from "react-router-dom";

const SearchSection = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const handleSearch = () =>
    navigate("/search", { state: { search: searchText } });
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Paper
        elevation={0}
        component="form"
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: "#E5E5E5",
          borderWidth: 1,
        }}
      >
        <InputBase
          sx={{ ml: 2, flex: 1 }}
          placeholder="Tìm kiếm dự án"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
        />
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton type="button" onClick={handleSearch}>
          <SearchOutlinedIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default SearchSection;
