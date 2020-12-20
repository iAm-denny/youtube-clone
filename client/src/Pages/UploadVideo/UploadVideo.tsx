import React, { useState } from "react";
import "./UploadVideo.scss";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";

const cookies = new Cookies();

function UploadVideo() {
  const [load, setLoad] = useState<Boolean>(false);
  const [file, setFile] = useState<any>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [video_url, setVideoUrl] = useState<any>("");
  const changeHandle = (e: any) => {
    setFile(e.target.files[0]);
  };

  const submitHandle = (e: any) => {
    setLoad(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "we6nofuq");
    formData.append("folder", "youtube");
    axios 
      .post("https://api.cloudinary.com/v1_1/dwnci9jxp/video/upload", formData)
      .then((res) => {
        axios.post('http://localhost:4000/video/post', {
            title:title,
            description: description,
            video_url: res.data.url
        }, {
            headers: {
            authorization: cookies.get("token")
            }
          }
        )
        })
        .then(() => {
            setLoad(false)
            toast.success('Upload Successfully');
        })
      .catch((err) => {
        setLoad(false);
        toast.error(err.message);
      });
  };

  return (
    <div className="form-container">
      <form onSubmit={submitHandle}>
        <h2>Upload Video</h2>
        <input type="hidden" />
        <input
          type="file"
          className={load ? "input active" : ""}
          onChange={changeHandle}
          required
        />
        <input
          type="text"
          placeholder="Enter Title..."
          className={load ? "input active" : ""}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Enter Description..."
          className={load ? "input active" : ""}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <button className={load ? "clicked active" : "clicked "}>Upload</button>
        <div className="note">
          <span>Note -</span> If video size is larger , it'll take time to
          upload
        </div>
        <div className={load ? "loader active" : "loader"}>
          <div></div>
          <div></div>
        </div>
      </form>
    </div>
  );
}

export default UploadVideo;
