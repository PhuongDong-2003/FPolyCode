import { isUndefined, omitBy } from "lodash"
import useQueryParams from "./useQueryParams"

const useQueryConfig = () => {
  const queryParam = useQueryParams()
  const queryConfig = omitBy({
    status: queryParam.status || 'ALL',
    search: queryParam.search
  }, isUndefined)

  return queryConfig;
}

export default useQueryConfig