import DateFnsUtils from '@date-io/date-fns';
import { createMuiTheme } from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { ThemeProvider } from '@material-ui/styles';
import React, { } from 'react';


const InputSet: React.FC<any> = ({ bD, setF }) => {
  let Theme = {
    palette: {
      primary: {
        main: "#1da1f2",
      }
    }
  }

  Theme = createMuiTheme(Theme);
  const now = new Date()
  const dateToday = new Date(`${now.getFullYear() - 12}/${now.getMonth()}/${now.getDay()}`)
  const handleDateChange = (date: any) => {
    // setSelectedDate(date);
    setF('birthdate', date)

  };

  return (
    <ThemeProvider theme={Theme}>    <MuiPickersUtilsProvider utils={DateFnsUtils} >
      <KeyboardDatePicker
        id="date-picker-dialog"
        label="Birthdate"
        format="yyyy-MM-dd"
        maxDate={dateToday}
        value={bD}
        onChange={handleDateChange}
      />
    </MuiPickersUtilsProvider>
    </ThemeProvider>

  )
}

export default InputSet;
