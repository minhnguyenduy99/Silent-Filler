
export default {
  readFileFromURL: (url) => {
    return new Promise((resolve, reject) => {
      try {
        fetch(url)
        .then(response => response.blob())
        .then(data => {
          let file = new FileReader()
          file.readAsDataURL(data)
          file.onload = (evt) => {
            console.log(evt.target.result)
            resolve(evt.target.result)
          }
        })
      } catch (err) {
        console.log(`Read file error: ${err}`)
        reject(err)
      }
    })
  },
  toBlobFromURL: async (url) => {
    try {
      let response = await fetch(url)
      return response.blob()
    } catch (err) {
      console.log(`Cannot read blob from URL ${url}`)
    }
  },
  toFileFromURL: async (url, fileName) => {
    try {
      let response = await fetch(url)
      let data = await response.blob()
      let file = new File([data], fileName)
      return file
    } catch (err) {
      console.log(`Read file error: ${err}`)
    }
  },
  toFileFromObject: (obj, fileName) => {
    try {
      var blob = new Blob([JSON.stringify(obj)], { type: 'application/json' })
      return new File([blob], fileName)
    } catch (err) {
      console.log(`Create file failed: ${err}`)
    }
  },
  toImageFileFromBase64: (data, fileName) => {
    let block = data.split(';')
    let contentType = block[0].split(':')[1]
    let realData = block[1].split(',')[1]
    let blob = b64toBlob(realData, contentType)
    return new File([blob], fileName)
  }
}

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ''
  sliceSize = sliceSize || 512

  var byteCharacters = atob(b64Data)
  var byteArrays = []

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize)

      var byteNumbers = new Array(slice.length)
      for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
      }

      var byteArray = new Uint8Array(byteNumbers)

      byteArrays.push(byteArray)
  }

  var blob = new Blob(byteArrays, { type: contentType })
  return blob
}
