import React from "react";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";
import "./WatchLater.scss";

function WatchLater() {
  return (
    <div className="watchLater-container">
        <h2>Watch later</h2>
        {
            [0,1,2,3,4,5].map(() => {
                return(
                    <Link to="/detail">
                    <div className="video">
                      <ReactPlayer
                        width="300px"
                        height="200px"
                        url="https://res.cloudinary.com/dwnci9jxp/video/upload/v1608018837/Different_Heaven_-_Nekozilla_LFZ_Remix_NCS_Release_okminx.mkv"
                      />
                    </div>
                    <div className="person">
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
                    </div>
                  </Link>
                )
            })
        }

    </div>
  );
}

export default WatchLater;
