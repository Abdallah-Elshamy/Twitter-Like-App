import './tweet.css';
import avatar from "../../routes/mjv-d5z8_400x400.jpg";
import { useHistory } from 'react-router';
import { Fragment } from 'react';


function TweetImg(props: any) {
  const history = useHistory();

  const goToProfile = () => {
    history.push({
      pathname: '/' + props.id,
    })
  }
  return (

    <Fragment>
      {
        props.imageURL ? (
          <img className={props.className} onClick={(e) => { goToProfile(); e.stopPropagation() }} src={props.imageURL}
            alt="avatar" />
        ) : (<img className={props.className} src={avatar} alt="avatar" />)
      }

    </Fragment>

  )
}

export default TweetImg;