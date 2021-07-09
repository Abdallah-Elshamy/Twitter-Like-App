import React, { Fragment } from 'react';
import { SideBar } from '../sideBar/sideBar';
import { ChatList } from './ChatList';
import avatar from "../../routes/mjv-d5z8_400x400.jpg"
import Messages from './Messages';
import Input from './Input';
import { Active_Chat_User } from '../../common/queries/Active_Chat_User';
import { useQuery } from '@apollo/client';

import "./Chat.css"


export const ChatPage: React.FC = () => {

  const { data, loading, error } = useQuery(Active_Chat_User)
  console.log("active chat users is",data)

  if (loading) return <p> loading </p>
  console.log("error: " + error)

  if (!error) var { id: userID, name, username, imgURL } = data.chatUser
  console.log(userID)


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

                <div className="person-item-image w-7 h-7  rounded-full  flex-none mr-2">
                  <img src={imgURL || avatar}
                    alt="avatar" />
                </div>

                <div className="space-y-0 ">
                  <h3 className="text-lg font-bold ">{name}</h3>
                </div>
              </div>
            </div>
          </header>

          <div >
            <div className="container">
              {/* {error && <p>ERROR</p>} */}
              <Messages userID={data?.chatUser?.id} />
            </div>
            <Input userID={data?.chatUser?.id} />
          </div>

        </article>

        <aside  className="sb-right" style={{height: "100vh",overflow: "hidden" }}>

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
