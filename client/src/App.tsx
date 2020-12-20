import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Header from "./Components/Header/Header";
import Detail from "./Pages/Detail/Detail";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login";
import Signup from "./Pages/Auth/Signup";
import Subscription from "./Pages/Subscription/Subscription";
import WatchLater from "./Pages/WatchLater/WatchLater";
import Channel from "./Pages/Channel/Channel";
import UploadVideo from "./Pages/UploadVideo/UploadVideo";
import { AuthContext, ProfileContext } from "./Helper/Context";
import Cookies from "universal-cookie";

toast.configure();
const cookies = new Cookies();

function App() {
  const [showBar, setShowBar] = useState<Boolean>(false);
  const [isAuth, setIsAuth] = useState<Boolean>(false);
  const [name, setName] = useState<string | number>("");
  const [profileImg, setProfileImg] = useState<any>("");

  function sideBarToggle() {
    setShowBar(!showBar);
  }

  const overlay: React.CSSProperties = {
    background: "#303030",
    position: "absolute",
    width: "100vw",
    height: " 100vh",
    top: "0",
    left: "0",
    zIndex: 999,
    opacity: "0.5",
  };

  const d: React.CSSProperties = {
    display: "none",
  };

  const getAuth = async (): Promise<any> => {
    try {
      const res = await fetch("http://localhost:4000/auth/is-verify", {
        method: "GET",
        headers: { authorization: cookies.get("token") },
      });
      const parseRes = await res.json();
      if (parseRes == true) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  async function getUserHeader() {
    const res = await fetch("http://localhost:4000/auth/user", {
      method: "GET",
      headers: { authorization: cookies.get("token") },
    });

    const parseRes = await res.json();

    setName(parseRes.user_name);
    setProfileImg(parseRes.profileimg);
  }
  useEffect(() => {
    getAuth();
    getUserHeader();
  }, []);

  return (
    <div>
      <div style={showBar ? overlay : d} onClick={sideBarToggle}></div>
      <AuthContext.Provider value={{ isAuth, setIsAuth }}>
        <ProfileContext.Provider value={{profileImg, setProfileImg, setName, name}}>
        <Header
          sideBarToggle={sideBarToggle}
          showBar={showBar}
          name={name}
          profileImg={profileImg}
        />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/detail/:id/:user_id" component={Detail} />
          <Route
            exact
            path="/login"
            render={() => (isAuth ? <Redirect to="/" /> : <Login />)}
          />
          <Route
            exact
            path="/signup"
            render={() => (isAuth ? <Redirect to="/" /> : <Signup />)}
          />
          <Route
            exact
            path="/subscription/:id"
            render={() =>
              isAuth ? <Subscription /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/channel/:id"
            render={() =>
              isAuth ? <Channel /> : <Redirect to="/login" />
            }
          />
          <Route
            exact
            path="/upload"
            render={() =>
              isAuth ? <UploadVideo /> : <Redirect to="/login" />
            }
          />
        </Switch>
        </ProfileContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
