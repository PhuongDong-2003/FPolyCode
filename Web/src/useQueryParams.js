import { useSearchParams } from "react-router-dom"

const useQueryParams = () => {
  const [searchParam] = useSearchParams();
  return Object.fromEntries(searchParam)
}

export default useQueryParams