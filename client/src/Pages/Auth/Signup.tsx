import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify'
import Cookies from "universal-cookie";
import { AuthContext } from '../../Helper/Context' 

interface Inputs {
  email: string;
  password: string | number;
  name: string | number
}
const cookies = new Cookies();
function Signup() {
  const [inputs, setInputs] = useState<Inputs>({ email: "", password: "", name:"" });
  const { setIsAuth } = useContext<any>(AuthContext)

  function changeHandle(e: any) {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  }
  const submitHandle = async ( e: React.FormEvent<HTMLFormElement> ): Promise<any> => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/auth/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(inputs)
      })
      const parseRes = await res.json()
      console.log(parseRes)
      if(parseRes.token) {
        toast.success("Signup Successfully")
        setIsAuth(true)
        cookies.set("token", parseRes.token)
      }else {
        toast.error(parseRes)
        setIsAuth(false)
      }
    }
    catch(err) {
      toast.error(err.message)
      setIsAuth(false)
    }
  };

  return (
    <div>
      <div className="form-container">
        <form onSubmit={submitHandle}>
          <h2>Sign up</h2>
          <input type="text" name="name" placeholder="Enter your name..." onChange={changeHandle} required/>
          <input type="email" name="email" placeholder="Enter your email..." onChange={changeHandle} required/>
          <input type="password" name="password" placeholder="Enter your password..." onChange={changeHandle} required/>
          <button>Signup</button>
          <Link to="/login"> ALready have an account? Login?</Link>
        </form>
      </div>
    </div>
  );
}

export default Signup;
