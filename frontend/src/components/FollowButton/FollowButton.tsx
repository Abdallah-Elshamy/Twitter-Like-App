import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { FOLLOW, UNFOLLOW } from '../../common/queries/Follow';
import './FollowButton.css'

type Props = {
  id: string
  py?: string
  px?: string
  following?: Boolean
}
const FollowButton: React.FC<Props> = ({ id, py = "py-0.5", px = "px-2", following = false }) => {
  const [followingState, setFollowing] = useState(following)
  const [follow, resFlw] = useMutation(FOLLOW)
  const [unfollow, resUnflw] = useMutation(UNFOLLOW)

  const handleFollow = () => {
    if (!resFlw.loading && !resUnflw.loading) {

      follow({ variables: { id: id } }).then(() => setFollowing(() => (true)))
    }

  }
  const handleUnFollow = () => {
    if (!resFlw.loading && !resUnflw.loading) {
      unfollow({ variables: { id: id } }).then(() => setFollowing(() => (false)))
    }

  }


  return (
    followingState ?
      < button
        className={"pf--follow-btn unfollow rounded-full  font-semibold  text-xm w-min  " + py + ' ' + px}
        onClick={(e) => { handleUnFollow(); e.stopPropagation() }}

      >
        <span className="following">Following</span>  <span className="unfollowing">Unfollow</span>
      </button > :
      < button className={"pf--follow-btn rounded-full  font-semibold  text-xm w-min  " + py + ' ' + px}
        onClick={(e) => { handleFollow(); e.stopPropagation() }}
      >
        Follow
  </button >

  )

}
export default FollowButton;
