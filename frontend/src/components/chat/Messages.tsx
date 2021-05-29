import React, { Fragment } from 'react';
import { SideBar } from '../sideBar/sideBar';
import { Chatpage } from './chat';
import { ChatList } from './ChatList';


export const MessagesComponent: React.FC = () =>  (
    <Fragment>
      <main className="main-container">
        <aside className="sb-left"><SideBar /></aside>
        <article className="wall">

          <Chatpage/>
        </article>
        <aside className="sb-right"><ChatList/></aside>

      </main>
    </Fragment>
);
