import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
let file = ''
function pathFile (url) {
  file = join(dirname(fileURLToPath(url)), 'data.json')
}
console.log(file)
