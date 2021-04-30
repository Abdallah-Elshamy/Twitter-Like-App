import { useHistory } from "react-router";



export const useGoToProfile = (id: string | Number) => {
  const history = useHistory();
  history.push({
    pathname: '/' + id,
  })
}