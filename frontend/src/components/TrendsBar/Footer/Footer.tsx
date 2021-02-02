import React from 'react';
type Props = {

}
const Footer: React.FC<Props> = (Props) => {


  return (
    <footer className=" px-4">
      <nav>
        <ul className="flex flex-wrap justify-start items-center" >
          <li className="mr-2 hover:underline"><a href="/">Credits</a></li>
          <li className="mr-2 hover:underline"><a href="/">About</a></li>
          <li className="mr-2 hover:underline"><a href="/">Developers</a></li>
          <li >© 2021 Twillio, Inc.</li>
        </ul>
      </nav>
    </footer>
  )
}
export default Footer;
