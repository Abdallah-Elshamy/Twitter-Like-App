import React, { useState } from 'react';
import './FollowButton.css'

type Props = {
  id: string
  py?: string
}
const FollowButton: React.FC<Props> = ({ id, py = "py-0.5" }) => {
  const [followed, setFollowed] = useState<boolean>(false)
  let btn
  const handleFollow = () => {
    setFollowed((f) => !f)
  }
  const handleUnFollow = () => {
    setFollowed((f) => !f)
  }





  return (
    followed ?
      < button className={"pf--follow-btn unfollow rounded-full px-2 font-semibold  text-xm w-min  " + py} onClick={handleUnFollow} >
        <span className="following">Following</span>  <span className="unfollowing">Unfollow</span>
      </button > : < button className={"pf--follow-btn   rounded-full px-2 font-semibold  text-xm w-min  " + py} onClick={handleFollow} >
        Follow
  </button >

  )

}
export default FollowButton;
