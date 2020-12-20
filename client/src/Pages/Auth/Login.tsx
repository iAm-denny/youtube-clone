import React,{ useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import './Login.scss'
import { toast } from 'react-toastify'
import Cookies from 'universal-cookie';
import { AuthContext, ProfileContext } from '../../Helper/Context' 

const cookies = new Cookies();

interface Inputs {
    email: string ;
    password: string | number;
}

function Login() {
    const [inputs, setInputs] = useState<Inputs>({ email: "", password: "" })
    const { setIsAuth } = useContext<any>(AuthContext)
    const { setProfileImg, setName } = useContext<any>(ProfileContext)

    function changeHandle(e: any) {
        setInputs({...inputs, [e.target.name]: e.target.value})
    }
    const submitHandle = async (e: React.FormEvent<HTMLFormElement>):Promise<any> => {
        e.preventDefault()
        try {
            const res = await fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(inputs)
            })
            const parseRes = await res.json();
            console.log(parseRes)
            if(parseRes.token) {
                toast.success("Log in successfully")
                cookies.set("token", parseRes.token)
                setProfileImg(parseRes.profileimg)
                setName(parseRes.user_name)
                setIsAuth(true)
            }else {
                toast.error(parseRes)
                setIsAuth(false)
            }
        }
        catch(err) {
            toast.error(err.message)
            setIsAuth(false)
        }
    }
    
    return (
        <div className="form-container">
            <form onSubmit={submitHandle}>
                <h2>Login</h2>
                <input type="email" placeholder="Enter your email..." name="email" onChange={changeHandle}  required/>
                <input type="password" placeholder="Enter your password..." name="password" onChange={changeHandle} required/>
                <button>Login</button>
                <Link to="/signup">Don't have an account?</Link>
            </form>

        </div>
    )
}

export default Login
