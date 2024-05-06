import { Box, TextField } from "@mui/material"

interface iSearchBarProps {
  onSearchChange: (searchQuery: string) => void;
}

const SearchBar = ({ onSearchChange }: iSearchBarProps) => {
    return (
        <Box
          sx={{
            width: 400,
            maxWidth: '100%',
            justifyContent: 'space-evenly',
          }}
        >
          <TextField fullWidth label="Search..." id="searchBar"
                      onChange={(e) => onSearchChange(e.target.value)} />
        </Box>
      );
}

export default SearchBar;