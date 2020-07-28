
export const STATUS = {
  HTTP_200_OK: 200,
  HTTP_201_CREATED: 201,
  HTTP_400_BAD_REQUEST: 400,
  HTTP_401_UNAUTHORIZED: 401,
  HTTP_403_FORBIDDEN: 403,
  HTTP_404_NOT_FOUND: 404,
  HTTP_500_INTERNAL_SERVER_ERROR: 500
}

export default class ResponseObject {
  error

  data

  /**
   * @type {number}
   */
  status

  constructor(data, error, status = STATUS.HTTP_200_OK) {
    this.data = data
    this.error = error
    this.status = status
  }

  isForbidden() {
    return this.status === STATUS.HTTP_403_FORBIDDEN
  }

  isBadRequest() {
    return this.status === STATUS.HTTP_400_BAD_REQUEST
  }
}
