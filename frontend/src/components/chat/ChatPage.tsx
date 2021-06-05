import React, { Fragment } from 'react';
import { SideBar } from '../sideBar/sideBar';
import ChatWindow from './Chat';
import { ChatList } from './ChatList';
import avatar from "../../routes/mjv-d5z8_400x400.jpg"

export const ChatPage : React.FC = () =>  (
    <Fragment>
        
      <main className="main-container">

        <aside className="sb-left"> 
        <SideBar/>
        </aside>

        <article className="wall" style={{height:"100vh", overflow:"hidden"}}>
        <header className="top-bar px-3 py-2 space-y-0 -mt-2">
            <div>
            <div className="flex">

                <div className=" w-7 h-7 rounded-full mr-2">
                  <img src={avatar}
                    alt="avatar" />
                </div>

                <div className="space-y-0 ">
                  <h3  className="text-lg font-bold ">aya</h3>
                  {/* <p><span className="text-xs font-thin">@</span>aya</p> */}
                </div>
                </div>
            </div>
          </header>

            <ChatWindow/>


        </article>

        <aside className="sb-right">

          <header className="top-bar px-3 py-2">
              <div className="font-bold text-lg">
                Messages
                </div>
          </header>
              <ChatList/>
         </aside>

      </main>
    </Fragment>
);