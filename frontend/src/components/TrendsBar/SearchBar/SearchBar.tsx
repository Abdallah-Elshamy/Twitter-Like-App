import React, { useState } from 'react';

import './SearchBar.css'
type Props = {

}
const SearchBar: React.FC<Props> = (Props) => {
  const [focus, setFocus] = useState<boolean>(false)
  const divFocus = (focus ? "focus" : "")
  const iconFocus = (focus ? "icon-focus" : "")
  //Hi working on my graduation project using react ts 
  return (
    <div className={"search-bar w-full  rounded-full px-4 py-3 mb-4 flex " + divFocus}>
      <div className="icon">
        <svg className={"w-4 h-4  search-icon" + iconFocus} fill="none"
          stroke="currentColor" viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      <div className="w-full"
        onClick={() => setFocus(true)}
        onBlur={() => setFocus(false)} >
        <input type="text" placeholder="Search somthing..."
          className="w-full search-input ml-2"
        />
      </div>
    
    </div>
  )
}
export default SearchBar;
