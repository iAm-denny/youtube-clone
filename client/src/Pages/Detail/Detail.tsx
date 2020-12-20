import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import moment from "moment";
import "./Detail.scss";
import Cookies from "universal-cookie";
import { toast } from "react-toastify";
import UploadVideo from "../UploadVideo/UploadVideo";
import axios from 'axios'
import { resolve4 } from "dns";

toast.configure();
const cookies = new Cookies();


interface Res {
  title: string;
  video_id: string | number;
  video_url: any;
  profileimg: any;
  user_id: string | number;
  user_name: string | number;
  timestamp: any;
  description: any;
}
interface Cmt {
  body: string;
  comment_id: string;
  profileimg: any;
  timestamp: string;
  user_name: string;
  user_id: string;
}
interface Props {
  toggleForm: Boolean;
  video_id: any;
  getComments:() => any;
}

function Detail(props: any) {
  const [video, setVideo] = useState<Res>({
    video_id: "",
    video_url: "",
    description: "",
    title: "",
    timestamp: "",
    user_id: "",
    user_name: "",
    profileimg: "",
  });
  const [pplCmt, setpplCmt] = useState("")
  const [cmts, setComments] = useState<Cmt[]>([]);
  const [likes, setLikes] = useState<number>(0);
  const [toggleForm, setToggleForm ] = useState<Boolean>(false)


  const specificVideo = async (): Promise<any> => {
    try {
      const resVideo = await fetch(
        `http://localhost:4000/video/specific-video/${props.match.params.id}`
      );
      const parseVideo = await resVideo.json();
      setVideo(parseVideo);
    } catch (err) {
      console.log(err);
    }
  };

  const getLike = async (): Promise<any> => {
    try {
      const res = await fetch(
        `http://localhost:4000/video/likes/${props.match.params.id}`
      );
      const parseRes = await res.json();
      setLikes(parseRes);
    } catch (err) {
      console.log(err);
    }
  };
  const likeBtn = async (e: any): Promise<any> => {
    axios.post(`http://localhost:4000/video/likes/${video.video_id}`, {
      "user_id": props.match.params.user_id
   }, {
    headers: {
    authorization: cookies.get("token")
    }
  }
   )
   .then(res => {
    if(res) {
      getLike();
    }
    console.log(res)
    getComments()
   })
   .catch(err => toast.error(err.message))

  };
  const getComments = async (): Promise<any> => {
    try {
      const res = await fetch(
        `http://localhost:4000/video/comments/${props.match.params.id}`
      );
      const parseRes = await res.json();
      setComments(parseRes);
      console.log(parseRes)
    } catch (err) {
      console.log(err);
    }
  };
  const postCmt = async (e:React.FormEvent<HTMLFormElement>):Promise<any> => {
    e.preventDefault()
       axios.post("http://localhost:4000/video/comments", {
        "cmt": pplCmt,
        "video_id": props.match.params.id
     }, {
      headers: {
      authorization: cookies.get("token")
      }
    }
     )
     .then(res => {
      toast.success("Add Comment")
      console.log(res)
      getComments()
     })
     .catch(err => toast.error(err.message))

  }

  const subscribe = async () => {
    axios.post("http://localhost:4000/video/subscription", {
      "user_id": props.match.params.user_id
   }, {
    headers: {
    authorization: cookies.get("token")
    }
  }
   )
   .then(res => {
    toast.success(res.data.follow)
    console.log(res.data.follow     )  
    getComments()
   })
   .catch(err => toast.error(err.message))
  }

  useEffect(() => {
    specificVideo();
    getLike();
    getComments();
  }, []);

  return (
    <div className="detailVideo-container">
      <ReactPlayer
        width="90vw"
        height="500px"
        controls
        className="reactPlayer"
        playing={true}
        url={video.video_url}
      />
      <div className="contents">
        <div className="title">{video.title}</div>
        <div className="buttons">
          <div className="like">
            <i className="fas fa-thumbs-up" title="Like" onClick={likeBtn}></i>
            <span style={{ fontSize: "15px", marginLeft: "10px" }}>
              {likes}
            </span>

            <button onClick={subscribe} className="subscribe">Subscribe</button>
      
          </div>
          <div className="save"></div>
        </div>
      </div>
      <div className="timestamp">{moment(video.timestamp).calendar()}</div>
      <div className="user">
        <div className="profile">
          <img src={video.profileimg} />
        </div>
        <div className="userD">
          <div className="user_name">{video.user_name}</div>
          <p className="description">{video.description}</p>
        </div>

      </div>
      {/* // comments */}
      <button onClick={() => setToggleForm(!toggleForm)} className="cmtBtn">Comments</button>
      {
        toggleForm && (
          <form className={toggleForm  ? "update active" : "update"} onSubmit={postCmt}>
          <input type="text" value={pplCmt} name="cmt" onChange={(e:React.ChangeEvent<HTMLInputElement>) => setpplCmt(e.target.value)} required/>
          <button className="cmtaddBtn">Add Comment</button>
      </form>
        )
      }
      <div className="comments-container">
        <h2 style={{ color: "#fff", textAlign: "center" }}>Comments</h2>
        {cmts.map((cmt) => {
          return (
            <div
              className="comments"
              style={{ borderBottom: "1px solid #333333", padding: " 15px 0 " }}
              key={cmt.comment_id}
            >
              <div className="profile">
                <img src={cmt.profileimg} alt="profileImg" />
                <div className="userD">
                  <div className="user_name">
                    {cmt.user_name}{" "}
                    <span className="timestamp">
                      <div className="timestamp">
                      {moment(cmt.timestamp).calendar()}
                      </div>
                    </span>
                  </div>
                  <p className="description">{cmt.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Detail;

