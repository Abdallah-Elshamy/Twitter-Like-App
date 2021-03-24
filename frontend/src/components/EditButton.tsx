import React from 'react';

import './FollowButton/FollowButton.css'


const EditButton: React.FC = () => {
  const showModal = () => {
    console.log("Modal")
  }

  return (
    < button onClick={showModal} className={"pf--follow-btn   rounded-full px-2 font-semibold  text-xm w-min  "}
    >
      Edit Profile
    </button >

  )

}
export default EditButton;
