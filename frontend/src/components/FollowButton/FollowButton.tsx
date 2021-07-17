import { useMutation } from '@apollo/client';
import React, { useState } from 'react';
import { FOLLOW, UNFOLLOW } from '../../common/queries/Follow';
import './FollowButton.css'
import {cache} from "../../common/cache"
import ErrorDialog from '../../UI/Dialogs/ErroDialog';
import {updateLoggedUserQueryForFollow, updateLoggedUserQueryForUnFollow} from "../../common/utils/writeCache"
import { CustomDialog } from 'react-st-modal';

type Props = {
  id: string
  py?: string
  px?: string
  following?: Boolean
  user:any
}
const FollowButton: React.FC<Props> = ({ id, py = "py-0.5", px = "px-2", following = false, user }) => {
  const [followingState, setFollowing] = useState(following)
  const [follow] = useMutation(FOLLOW, {
    update(cache) {
      const userNew = {...user}
      console.log("user to be followed is", user)
      userNew.isFollowing= true
      console.log("user to be followed after is", userNew)
      updateLoggedUserQueryForFollow(cache, userNew)
    }
  })
  const [unfollow] = useMutation(UNFOLLOW, {
    update(cache) {
      const userNew = {...user}
      userNew.isFollowing= false
      updateLoggedUserQueryForUnFollow(cache, userNew)
    }
  })

  const handleFollowButton = async(e: any) => {
    let tryingToFollow: boolean;
    console.log("called")
    try {
      if(!following) {
        tryingToFollow = true;
        cache.modify({
          id: `User:${id}`,
          fields: {
              isFollowing() {
                  return true;
              },
          },  
        });
        await follow({
          variables: {
            id: id
          }
        })
      } else {
        tryingToFollow = false;
        cache.modify({
          id: `User:${id}`,
          fields: {
            isFollowing() {
                  return false;
              }
          },  
        });
        await unfollow({
          variables: {
            id: id
          }
        })
      }
      
    } catch (e) {
      console.log("error", e.message)
      if(e.message === "Cannot read property 'split' of undefined") return;
      cache.modify({
        id: `User:${id}`,
        fields: {
            isFollowing(cachedIsFollowing: any) {
                return !cachedIsFollowing;
            },
        },  
      });
  
      const error = await CustomDialog(<ErrorDialog message={"Something went wrong please try again!"} />, {
        title: 'Error!',
        showCloseIcon: false,
      });
      }
  }
  
  return (
    following ?
      < button
        className={"pf--follow-btn unfollow rounded-full  font-semibold  text-xm w-min " + py + ' ' + px}
        onClick={(e) => { handleFollowButton(e); e.stopPropagation() }}

      >
        <span className="following">Following</span>  <span className="unfollowing">Unfollow</span>
      </button > :
      < button className={"pf--follow-btn rounded-full  font-semibold  text-xm w-min  " + py + ' ' + px}
        onClick={(e) => { handleFollowButton(e); e.stopPropagation() }}
      >
        Follow
  </button >

  )

}
export default FollowButton;
