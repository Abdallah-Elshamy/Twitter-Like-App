export function timeConverter(UNIX_timestamp: number, hours?: Boolean,days:boolean=false): string {
  var a = new Date(UNIX_timestamp);
  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year + ' ';
  if (!days) return  hour + ':' + min + ':' + sec
  time = hours ? time + hour + ':' + min + ':' + sec : time;


  return time;
}
