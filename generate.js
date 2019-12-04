const xlsx2json = require('xlsx2json')
const fs = require('fs-extra')
const path = require('path')

const entryPath = './locale.xlsx'
const outputPath = './src/locales'

xlsx2json(entryPath, {
  sheet: 0,
}).then((jsonArray) => {
  const title = Object.values(jsonArray.shift())
  title.shift()
  const exportObj = title.map(() => {
    return {}
  })

  jsonArray.forEach((arrItem) => {
    const rowItem = Object.values(arrItem)
    const id = rowItem.shift().trim()
    if (id) {
      title.forEach((tmp, index) => {
        exportObj[index][id] = rowItem[index].trim()
      })
    }
  })

  fs.emptyDirSync(path.resolve(__dirname, outputPath))

  title.forEach((item, index) => {
    fs.emptyDirSync(path.resolve(__dirname, `${outputPath}/${item}`))
    if (item) {
      fs.writeFile(
        path.resolve(__dirname, `${outputPath}/${item.trim()}/index.js`),
        `export default ${JSON.stringify(exportObj[index])}`,
        (err) => {
          if (err) throw err
          console.log(`${outputPath}/${item}/index.js generate success`)
        }
      )
    }
  })
})
