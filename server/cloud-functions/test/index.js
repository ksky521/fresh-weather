exports.main = async (event) => {
  let {a, b} = event
  return new Promise((resolve, reject) => {
    resolve({result: parseInt(a) + parseInt(b)})
  })
}
