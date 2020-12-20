import React, {useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import moment from "moment";
import "./Home.scss";

interface Res {
  title: string;
  video_id: number;
  video_url: any,
  profileimg: any;
  user_id: number;
  user_name: string | number,
  timestamp: any
}

function Home() {
  const [ videos, setVideos ] = useState<Res[]>([])

  const getVideos = async () => {
    const res = await fetch("http://localhost:4000/video/videos", )
    const parseRes = await res.json()
    setVideos(parseRes)
  }
  useEffect(() => {
    getVideos()
  },[])

  return (
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
    </div>
  );
}

export default Home;
