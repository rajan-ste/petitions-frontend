import { Alert } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import Box from '@mui/material/Box';
import { Link, useLocation } from 'react-router-dom';

const Home = () => {
    const location = useLocation();
    const login = location.state?.login;
    return (
        <div>
            <h1>Home</h1>
            <div style={{ marginTop: '30vh', marginLeft: '30vh', marginRight: '30vh' }}>
                <Box component="section" sx={{ p: 5, border: '1px solid black' }}>
                    Have a look at some petitions <Link to={"/petitions"} 
                                                   style={{ textDecoration: 'none', color: 'blue' }}>
                                                   here</Link>
                </Box>
            </div>
            {login ?    <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                            Login successful.
                         </Alert> : ""}
        </div>
    )
}

export default Home;