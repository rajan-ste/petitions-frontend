import { Box, TextField } from "@mui/material"

const SearchBar = () => {
    return (
        
        <Box
          sx={{
            width: 500,
            maxWidth: '100%',
            justifyContent: 'space-evenly',
          }}
        >
          <TextField fullWidth label="Search..." id="searchBar" />
        </Box>
      );
}

export default SearchBar;