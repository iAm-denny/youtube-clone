import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.scss";
import { AuthContext } from "../../Helper/Context";
import Cookies from "universal-cookie";
import axios from "axios";
import moment from "moment";

const cookies = new Cookies();

interface notiUsers {
  profileimg: any;
  user_name: string;
  video_id: string | number;
  timestramp: any;
  read: Boolean;
  notification_id: any;
}

function Header({ sideBarToggle, showBar, name, profileImg }: any) {
  const { isAuth, setIsAuth } = useContext<any>(AuthContext);
  const [toggle, setToggle] = useState<Boolean>(false);
  const [notis, setNoti] = useState<notiUsers[]>([]);
  const [unread, setUnread] = useState<number>(0);

  const logout = () => {
    cookies.remove("token");
    setIsAuth(false);
  };
  const toggleNoti = () => {
    setToggle(!toggle);
    readNoti()
    getNoti()

  };
  async function readNoti() {
    try {
      const res = await fetch("http://localhost:4000/video/readnotification", {
        method: "POST",
        headers: { authorization: cookies.get("token") }
      })
    }
    catch(err) {
      console.log(err)
    }
  }
  function getNoti() {
    axios
      .get("http://localhost:4000/video/readnotification", {
        headers: {
          authorization: cookies.get("token"),
        },
      })

      .then((res) => {
        setUnread(res.data.getUnread.count);
        setNoti(res.data.getNotification);
      })
      .catch((err) => console.log(err));
  }

  useEffect(() => {
    getNoti();
  }, []);

  return (
    <header>
      <div>
        <div className="burger" onClick={sideBarToggle}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div id="logo">
          <Link to="/">
            <img
              src="https://cdn.worldvectorlogo.com/logos/youtube-icon.svg"
              width="30px"
              height="30px"
            />{" "}
            <div>Youtube</div>
          </Link>
        </div>
      </div>
      <div className="auth">
        {isAuth ? (
          <div className="logout">
            <Link
              to="/channel/1"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              <div className="user">
                <img src={profileImg} alt="profileImg" />
                <div>{name}</div>
              </div>
            </Link>
            <div className="notiLog">
              <div onClick={toggleNoti}>
                <i className="fas fa-bell"></i>
                {unread !== 0 ? (
                  <span className="unread"> {unread == 0 ? null : unread}</span>
                ) : null}

                {toggle && (
                  <ul>
                    {notis.map((noti) => {
                      return (
                        <>
                          <li key={noti.notification_id}>
                            <Link to="/detail/123">
                              <img src={noti.profileimg} />
                              {noti.user_name} liked your video!
                              <br />
                              <span className="timestamp">
                                {moment(noti.timestramp).calendar()}
                              </span>
                            </Link>
                          </li>
                        </>
                      );
                    })}
                  </ul>
                )}
              </div>
              <Link to="/" onClick={logout}>
                Logout
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="login">
              <Link to="/login">Login</Link>
            </div>
            <div className="signin">
              <Link to="/signup">Sign Up</Link>
            </div>
          </>
        )}
      </div>
      <SideBar showBar={showBar} />
    </header>
  );
}

export default Header;

interface Props {
  showBar: Boolean;
}

function SideBar({ showBar }: Props) {
  return (
    <div className={showBar ? "sidebar active" : "sidebar"}>
      <ul>
        <li>
          <div className="icon">
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              <i className="fas fa-home"></i>
            </Link>
          </div>
          <div className="title">
            <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
              Home
            </Link>
          </div>
        </li>
        <li>
          <div className="icon">
            <Link
              to="/subscription/1"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <i className="fas fa-photo-video"></i>
            </Link>
          </div>
          <div className="title">
            <Link
              to="/subscription/1"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Subscription
            </Link>
          </div>
        </li>
        {/* <li>
          <div className="icon">
            <Link to="/watchlater/1" style={{color: "#fff", textDecoration:"none"}}><i className="fas fa-clock"></i></Link>
          </div>
          <div className="title"><Link to="/watchlater/1" style={{color: "#fff", textDecoration:"none"}}>Watch Later</Link></div>
        </li> */}
        <li>
          <div className="icon">
            <Link
              to="/upload"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              <i className="fas fa-clock"></i>
            </Link>
          </div>
          <div className="title">
            <Link
              to="/upload"
              style={{ color: "#fff", textDecoration: "none" }}
            >
              Upload Video
            </Link>
          </div>
        </li>
      </ul>
    </div>
  );
}
