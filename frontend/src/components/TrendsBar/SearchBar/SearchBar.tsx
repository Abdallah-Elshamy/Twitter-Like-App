import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { useHistory } from 'react-router';
import { searchBarVar } from '../../../common/cache';
import { Get_SearchBar_Value } from '../../../common/queries/Get_SearchBar_Value';

import './SearchBar.css'
type Props = {
  //No props intially

}
const SearchBar: React.FC<Props> = () => {
  // focus and un focus handling for ui 
  const [focus, setFocus] = useState<boolean>(false)
  const divFocus = (focus ? "focus" : "")
  const iconFocus = (focus ? "icon-focus" : "")

  const { data } = useQuery(Get_SearchBar_Value)

  const searchBarValue = data.searchBarValue.value
  const history = useHistory();

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchBarValue !== "") {
        history.push({
          pathname: '/explore/results/',
          search: 'name=' + searchBarValue
        })
      }

    }
  }



  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchBarVar({ value: e.target.value })
  }

  return (
    <div className={"search-bar  w-full  rounded-full px-4 py-2.5  flex " + divFocus}>
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
          aria-autocomplete="list" aria-label="Search query"
          aria-owns="typeaheadDropdown-3"
          autoCapitalize="sentences" autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          onKeyPress={handleKeyPress}
          value={searchBarValue}
          onChange={handleChange}

        />
      </div>

    </div>
  )
}
export default SearchBar;
