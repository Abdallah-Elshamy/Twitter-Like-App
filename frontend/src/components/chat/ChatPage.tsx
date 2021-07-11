import React, { Fragment } from 'react';
import { SideBar } from '../sideBar/sideBar';
import { ChatList } from './ChatList';
import avatar from "../../routes/mjv-d5z8_400x400.jpg"
import Messages from './Messages';
import Input from './Input';
import { Active_Chat_User } from '../../common/queries/Active_Chat_User';
import { useQuery } from '@apollo/client';

import "./Chat.css"
import FoF from '../../UI/FoF/FoF';


export const ChatPage: React.FC = () => {

  const { data, loading, error } = useQuery(Active_Chat_User)


  if (!error && !loading) var { id: userID, name, username, imgURL } = data.chatUser


  return (
    <Fragment>

      <main className="main-container">

        <aside className="sb-left">
          <SideBar />
        </aside>


        <div className="wall" style={{ height: "100vh", overflow: "none" }} >
          <header className="top-bar px-3 py-2 space-y-0 -mt-2">
            <div>
              <div className="flex">

                {imgURL && <div className="person-item-image w-7 h-7  rounded-full  flex-none mr-2">
                  <img src={imgURL}
                    alt="avatar" />
                </div>}

                <div className="space-y-0 ">
                  <h3 className="text-lg font-bold ">{name}</h3>
                </div>
              </div>
            </div>
          </header>

          <div >
            {error ? <FoF fof={false}
              msg="You don’t have a message selected"
              secMsg="Select one or search for some people"
            ></FoF> :
              <Fragment><div className="container">
                {/* {error && <p>ERROR</p>} */}
                {userID ? <Fragment>
                  <Messages userID={userID} />
                  <Input userID={userID} />
                </Fragment> :
                  <FoF fof={false} msg={"You don't have any message"} secMsg={"try searching for some user"} />}


              </div>
              </Fragment>}

          </div>

        </div>

        <div className="sb-right" style={{ height: "100vh", overflow: "hidden" }}>

          <header className="top-bar px-3 py-2">
            <div className="font-bold text-lg">
              Messages
            </div>
          </header>
          <ChatList />


        </div>

      </main>
    </Fragment>
  )
};
