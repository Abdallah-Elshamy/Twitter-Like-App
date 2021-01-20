import React, { Fragment } from 'react';
import '../App.css';
import '../styles/layout.css'

function Profile() {
  return (
    <Fragment>
        <main className="main-container">
        <aside className="sb-left">left</aside>
          <article className="wall">mid</article>
          <aside className="sb-right">right</aside>
          
        </main>
    </Fragment>
  );
}

export default Profile;