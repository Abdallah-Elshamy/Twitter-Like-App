import React, { Fragment } from 'react';
import '../App.css';
import TrendsBar from '../components/TrendsBar/TrendsBar';
import '../styles/layout.css'

function Profile() {
  return (
    <Fragment>
      <main className="main-container">
        <aside className="sb-left">left</aside>
        <article className="wall">mid</article>
        <aside className="sb-right">
          <TrendsBar />
        </aside>

      </main>
    </Fragment>
  );
}

export default Profile;