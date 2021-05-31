import React from 'react';
import { StreamChat } from 'stream-chat';
import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window, ChannelList } from 'stream-chat-react';

import 'stream-chat-react/dist/css/index.css';

const chatClient = StreamChat.getInstance('dz5f4d5kzrue');
const userToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoib3JhbmdlLW1vdW50YWluLTQiLCJleHAiOjE2MjIyNDYzNzB9.u6VMJ5MTmOgD5P3Z_A2LLy5fJtmzkCSI2coyeZmWAOA';

chatClient.connectUser(
  {
    id: 'orange-mountain-4',
    name: 'orange',
    image: 'https://getstream.io/random_png/?id=orange-mountain-4&name=orange',
  },
  userToken,
);

const channel = chatClient.channel('messaging', 'orange-mountain-4', {
  // add as many custom fields as you'd like
  image: 'https://www.drupal.org/files/project-images/react.png',
  name: 'Aya',
  members: ['orange-mountain-4'],
});

export const Chatpage: React.FC = () => (
  <Chat client={chatClient} theme='messaging dark'>
    <Channel channel={channel}>
      <Window>
        <ChannelHeader />
        <MessageList />
        <MessageInput />
      </Window>
      <Thread />
      <ChannelList showChannelSearch options={{ limit: 10, watch: true }} />

    </Channel>
  </Chat>

)
