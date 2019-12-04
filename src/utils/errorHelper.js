const promiseErrorWrapper = (promise) => {
  return promise
    .then((data) => {
      return [data]
    })
    .catch(err => [null, err])
}
/* eslint-disable */
export { promiseErrorWrapper }
/* eslint-enable */
