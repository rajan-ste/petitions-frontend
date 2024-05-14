import { Button } from "@mui/material";
import useStore from "../store";
import { Link as RouterLink } from "react-router-dom";

const Account = () => {
    const { delToken } = useStore();
    return (
        <>
        <h1>Account</h1>
        <Button onClick={delToken} variant="contained" color="primary">
            Logout
        </Button>
        <Button component={RouterLink} to="/account/create" variant="contained" color="primary">
            Create
        </Button>
        </>
        
        
    )
}

export default Account;