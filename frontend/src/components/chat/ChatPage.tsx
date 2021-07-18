import React, { Fragment } from 'react';
import { SideBar } from '../sideBar/sideBar';
import { ChatList } from './ChatList';
import Messages from './Messages';
import Input from './Input';
import { Active_Chat_User } from '../../common/queries/Active_Chat_User';
import { useQuery } from '@apollo/client';

import "./Chat.css"
import FoF from '../../UI/FoF/FoF';

export const ChatPage: React.FC = () => {

 
  const { data, loading, error } = useQuery(Active_Chat_User)


  if (!error && !loading) var { id: userID, name, imgURL } = data.chatUser


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
{/* 
              <Link to ="">

              <i className="fa fa-arrow-left  p--main-color mr-3" aria-hidden="true"></i>

              </Link> */}
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

          <div>
            { error ? <div>
              <div className="hidden lg:block md:block">
                <FoF fof={false}
                className="mt-60 "
                msg="You don’t have a message selected"
                secMsg="Select one or search for some people"
              ></FoF> 
          </div>


            <div className="md:hidden">
              <div className="wall mb-80" style={{ height: "100vh", overflow: "hidden"}}>
                    <ChatList />
                    </div>
                </div>
            </div>
            :
              <Fragment><div className="container">
                {userID ? <Fragment>
                  <Messages userID={userID} />
                  <Input userID={userID} />
                </Fragment> :
                  <FoF  fof={false} msg={"You don't have any message"} secMsg={"try searching for some user"}/>}


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
