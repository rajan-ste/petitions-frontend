import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h1>Home</h1>
            <div style={{ marginTop: '30vh', marginLeft: '30vh', marginRight: '30vh' }}>
                <Box component="section" sx={{ p: 5, border: '1px solid black' }}>
                    Have a look at some petitions <Link to={"/petitions"} style={{ textDecoration: 'none', color: 'blue' }}>here</Link>
                </Box>
            </div>
        </div>
    )
}

export default Home;