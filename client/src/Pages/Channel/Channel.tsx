import React,{ useState, useContext } from "react";
import "./channel.scss";
import { ProfileContext } from '../../Helper/Context'

function Channel() {
    const [ toggleForm, setToggleForm ] = useState<Boolean>(false)
    const { name, profileImg  } = useContext<any>(ProfileContext)
  return (
    <>
      <div className="channel-container">
        <div className="image">
          <img src={profileImg} />
          {name}
        </div>
        <div className="follow">
          <button onClick={() => setToggleForm(!toggleForm)}>Update Profile Image</button>
          <div>
            Followers - <span>15</span>
          </div>
        </div>
      </div>
      <UpdateProfile toggleForm={toggleForm} />
    </>
  );
}

export default Channel;

interface Props {
    toggleForm: Boolean
}
function UpdateProfile({toggleForm}: Props) {
    return (
        <form className={toggleForm  ? "update active" : "update"}>
            <input type="hidden" value="123" />
            <input type="file" />
            <button>Update</button>
        </form>
    )
}
