import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RedirectIfAuth({ children }) {
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/check`, {
            method: "GET",
            credentials: "include",
        })
        .then(res => {
            if (res.ok) {
                navigate("/");
            }
        })
        .catch(err => {
            console.log(err)
        });
    }, []);

    return children;
}

export default RedirectIfAuth;
