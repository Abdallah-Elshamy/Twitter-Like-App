import React, { Fragment } from 'react';
import { SideBar } from '../sideBar/sideBar';
import { ChatList } from './ChatList';
import avatar from "../../routes/mjv-d5z8_400x400.jpg"
import ChatWindow from './ChatWindow';
import Messages from './Messages';
import { Input } from '@material-ui/core';
import { Active_Chat_User } from '../../common/queries/Active_Chat_User';
import { useQuery } from '@apollo/client';


export const ChatPage: React.FC = () => {

  const user = useQuery(Active_Chat_User)
  const { id: userID, name, username, imgURL } = user.data.chatUser

  return (
    <Fragment>

      <main className="main-container">

        <aside className="sb-left">
          <SideBar />
        </aside>

        <article className="wall" style={{ height: "100vh", overflow: "hidden" }}>
          <header className="top-bar px-3 py-2 space-y-0 -mt-2">
            <div>
              <div className="flex">

                <div className=" w-7 h-7 rounded-full mr-2">
                  <img src={imgURL}
                    alt="avatar" />
                </div>

                <div className="space-y-0 ">
                  <h3 className="text-lg font-bold ">{name}</h3>
                </div>
              </div>
            </div>
          </header>

          <div style={{ height: "100vh", overflow: "scroll" }}>
            <div className="container">
              <Messages userID={userID} />
            </div>
            <Input />
          </div>


        </article>

        <aside className="sb-right">

          <header className="top-bar px-3 py-2">
            <div className="font-bold text-lg">
              Messages
                </div>
          </header>
          <ChatList />
        </aside>

      </main>
    </Fragment>
  )
};