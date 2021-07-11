export const timeDiff = (t: number) => {
  const now = new Date().getTime()
  const msgTime = new Date(t).getTime();
  let diff = Math.ceil((now - msgTime) / 1000);
  console.log(diff)
  if (diff < 60) return diff + " secs"
  diff = Math.ceil(diff / 60)
  if (diff < 60) return diff + " mins"
  diff = Math.ceil(diff / 60)
  if (diff < 24) return diff + " h"
  diff = Math.ceil(diff / 24)
  if (diff < 7) return diff + " days"
  diff = Math.ceil(diff / 7)
  if (diff < 52) return diff + " weeks"
  diff = Math.ceil(diff / 52)
  return diff + " years"
}