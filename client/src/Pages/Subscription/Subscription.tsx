import React,{ useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import "../Home/Home.scss";
import moment from "moment";

interface Res {
  title: string;
  video_id: number;
  video_url: any,
  profileimg: any;
  user_id: number;
  user_name: string | number,
  timestamp: any
}
const cookies = new Cookies();
function Subscription() {
  const [ videos, setVideos ] = useState<Res[]>([])

  async function getSubscribeppl () {
    try {
      const res = await fetch("http://localhost:4000/video/subscription", {
        method: "GET",
        headers: {authorization: cookies.get("token")}
      })
      const parseRes = await res.json()
      setVideos(parseRes)
    }
    catch(err) {
      console.log(err)
    }

  }

  useEffect(() => {
    getSubscribeppl()
  },[])

  return (
    <>
        { videos.length ===0 && <h2 style={{color: "#fff", position: "absolute", top: "100px"}}>You havent subscribed yet.</h2> }
    <div className="video-container">
  
    {videos.map((video) => {
        return (
          <div className="video" key={video.video_id}>
            <Link to={`/detail/${video.video_id}/${video.user_id}`}>
            <ReactPlayer width="300px" height="200px" url={video.video_url} />
            <div className="user">
                <div className="profile">
                  <img src={video.profileimg} />
                </div>
                <div>
                    <div className="title">{video.title}</div>
                    <div className="user_name">{video.user_name}</div>
                    <div className="timestamp">{moment(video.timestamp).calendar()}</div>
                </div>
            </div>
            </Link>
          </div>
        );
      })}

    {/* {[0, 1, 2, 3, 4, 5].map(() => {
      return (
        <div className="video" >
          <Link to="/detail">
          <ReactPlayer width="300px"  height="200px" url='https://res.cloudinary.com/dwnci9jxp/video/upload/v1608018837/Different_Heaven_-_Nekozilla_LFZ_Remix_NCS_Release_okminx.mkv' />
          <div className="user">
              <div className="profile">
                <img src="https://simg.nicepng.com/png/small/851-8517636_skin-element-http-i-imgur-com-t8thkso-girl.png" />
              </div>
              <div>
                  <div className="title">Cool Music</div>
                  <div className="user_name">Denny</div>
                  <div className="timestamp">30 minutes ago</div>
              </div>
          </div>
          </Link>
        </div>
       
      );
    })} */}
  </div>
  </>
  );
}

export default Subscription;
