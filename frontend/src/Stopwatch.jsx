import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Stopwatch() {

    const navigate = useNavigate();

    const [elapsedTime, setElapsedTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [username, setUsername] = useState("")
    const [timestampsArray, setTimestampsArray] = useState([])

    const [timesAdded, setTimesAdded] = useState(0)

    const startTimeRef = useRef();
    const intervalIdref = useRef();

    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        navigate("/login");
    }

    const sendTimestamp = async () => {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/time/timestamps`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ time: formatTime() })
        });
        setTimesAdded(t => t + 1)
    }

    useEffect(() => {
        document.title = "Home"
    }, [])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/check`, {
            method: "GET",
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) throw new Error("Not authenticated")
                return res.json();
            })
            .then(data => {
                setUsername(data.username)
            })
            .catch(err => {
                console.log(err);
                navigate("/login")
            })
            .finally(() => setLoading(false));
    }, [navigate])

    
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/time/timestamps`, {
            method: "GET",
            credentials: "include",
        })
        .then(res => {
                if (!res.ok) throw new Error("Not authenticated")
                return res.json();
            })
            .then(data => {
                setTimestampsArray(data);
            })
            .catch(err => {
                console.log(err)
            })
    }, [timesAdded])
    

    useEffect(() => {
        if (isRunning) {
            intervalIdref.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current)
            }, 10);
        }
        else {
            return (
                clearInterval(intervalIdref.current)
            )
        }
        
    }, [isRunning])

    const deleteTimestamp = async (id) => {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/time/timestamps/${id}`, {
            method: "DELETE",
            credentials: "include",
        });

        setTimestampsArray(prev =>
            prev.filter(t => t._id !== id)
        );
    };

    if (loading) return null;
    
    const start = () => {
        setIsRunning(true)
        startTimeRef.current = Date.now() - elapsedTime;
    }

    const stop = () => {
        setIsRunning(false)
    }

    const reset = () => {
        setElapsedTime(0)
        setIsRunning(false)
    }

    const formatTime = () => {
        let milliseconds = Math.floor(elapsedTime % 1000 / 10);
        let seconds = Math.floor(elapsedTime / 1000 % 60);
        let minutes = Math.floor(elapsedTime / (1000 * 60) % 60)

        milliseconds = String(milliseconds).padStart(2, "0")
        seconds = String(seconds).padStart(2, "0")
        minutes = String(minutes).padStart(2, "0")


        return (
            `${minutes}:${seconds}:${milliseconds}`
        )
    }



    return (
        <div className="h-screen w-screen bg-gray-900 flex items-center justify-around flex-col">
            <h1 className="text-amber-50 text-6xl text-center m-4">Welcome {username}!</h1>
            <div className="bg-gray-800 rounded-xl flex flex-col items-center justify-around p-4 pb-2 px-10">
                <h1 className="text-amber-50 text-6xl text-center">{formatTime()}</h1>
                <div className="flex mt-12">
                    <button onClick={start} className="cursor-pointer h-10 w-16 m-1  rounded font-medium text-xl px-1 text-white font-mono bg-green-700 hover:scale-110 transition duration-200 hover:bg-green-900">Start</button>
                    <button onClick={stop} className="cursor-pointer h-10 w-16 m-1  rounded font-medium text-xl px-1 text-white font-mono bg-amber-700 hover:scale-110 transition duration-200 hover:bg-amber-900">Stop</button>
                    <button onClick={reset} className="cursor-pointer h-10 w-16 m-1  rounded font-medium text-xl px-1 text-white font-mono bg-sky-700 hover:scale-110 transition duration-200 hover:bg-sky-900">Reset</button>
                </div>
                <button onClick={sendTimestamp} className={`h-10 w-[95%] mt-1 mb-4 rounded font-medium text-xl px-1 text-white font-mono hover:scale-110 transition duration-200 ${formatTime() === "00:00:00" ? "bg-gray-600 hover:bg-gray-700" : "bg-green-700 hover:bg-green-900"}`}>Save</button>
            </div>
            <div className="bg-gray-800 rounded-xl flex my-4 min-h-50 max-h-100">
                <div className="flex flex-col items-center p-2 pr-2">
                    <h2 className="text-amber-50 text-3xl text-center p-4 pt-1 sticky">Saved timestamps:</h2>
                    <div className="overflow-y-auto w-full">
                        {
                            (timestampsArray.length != 0) ? (
                                timestampsArray.map((timestamp => (
                                    <div key={timestamp._id} className="rounded bg-slate-600 mx-1 mb-1 relative">
                                        <h3 className="text-amber-50 text-xl text-center p-1">{timestamp.time}</h3>
                                        <button onClick={() => deleteTimestamp(timestamp._id)} className="absolute top-1/2 -translate-y-1/2 right-2 bg-red-800 w-6 rounded text-white hover:scale-110 hover:bg-red-900 transition duration-300 cursor-pointer w-7 h-7 flex items-center justify-center">
                                            <img src="src/assets/cross-white-icon.webp" alt="" className="w-[70%] h-[70%] object-contain select-none pointer-events-none" />
                                        </button>
                                    </div>
                                ))
                                )) :
                                <div className="text-xl text-white mt-8 justify-self-center">Empty</div>
                        }
                    </div>
                </div>
            </div>
            <span onClick={logout} className="text-xl text-sky-200 underline hover:scale-120 transition duration-200 m-2 cursor-pointer">Log out</span>
        </div>
    );


}

export default Stopwatch