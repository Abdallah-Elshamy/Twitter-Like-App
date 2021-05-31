import React, { Fragment } from 'react';
import { SideBar } from '../sideBar/sideBar';
import ChatWindow from './Chat';
import { ChatList } from './ChatList';

export const ChatPage : React.FC = () =>  (
    <Fragment>
        
      <main className="main-container">

        <aside className="sb-left"> 
        <SideBar/>
        </aside>

        <article className="wall">
        <header className="top-bar px-3 py-2">
            <div className="font-bold text-lg">
              Name
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