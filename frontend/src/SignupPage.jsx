import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import RedirectIfAuth from "./RedirectIfAuth";

function SignupPage() {

    useState(() => {
        document.title = "Sign up"
    })
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [passWord, setPassWord] = useState("");
    const [message, setMessage] = useState("");

    const handleSignup = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/signup`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: userName, password: passWord })
            });

            const data = await res.json()


            if (res.ok) {
                setMessage(data.message)
                setUserName("")
                setPassWord("")
                navigate("/")
            }
            else {
                setMessage(data.error)
            }
        }
        catch {
            setMessage("Server not reachable")
        }
    }

    return (
        <RedirectIfAuth>
            <div className="bg-gray-900 h-screen items-center justify-center flex">
                <div className="flex flex-col items-center justify-start w-80 bg-gray-800 rounded-xl relative">
                    <h1 className="font-medium text-4xl m-4 text-white mb-12">Sign up</h1>
                    <p className={`text-md leading-loose absolute top-16 ${message.includes("success") ? "text-green-500" : "text-red-600"}`}>{message}</p>
                    <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Username" className="bg-white font-medium border-2 rounded-md border-gray-950 p-[2px] px-2 m-2 mb-1" />
                    <input type="password" value={passWord} onChange={e => setPassWord(e.target.value)} placeholder="Password" className="bg-white font-medium border-2 rounded-md border-gray-950 p-[2px] px-2 m-2 mt-1 mb-2" />
                    <button onClick={handleSignup} className="cursor-pointer bg-amber-700 text-white p-[2px] px-[6px] font-medium text-lg rounded mt-2 hover:scale-110 hover:bg-amber-800 transition duration-300">Sign up</button>
                    <Link to="/login" >
                        <button className="cursor-pointer text-amber-700 p-[2px] px-[6px] font-medium text-lg rounded m-4 mt-3 hover:scale-110 transition duration-300">
                            Log In
                        </button>
                    </Link>
                </div>
            </div>
        </RedirectIfAuth>
    );
}

export default SignupPage;