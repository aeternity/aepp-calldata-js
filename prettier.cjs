const fs = require('fs/promises')

const comment = '// temp comment to fool Prettier'

const readFileOrig = fs.readFile
fs.readFile = async (path, ...args) => {
    if (!path.toString().endsWith('.js')) {
        return readFileOrig(path, ...args)
    }

    const code = await readFileOrig(path, ...args)
    return (
        code
            // don't collapse function call if multiline
            .replaceAll(/ (\w+)\(\n(\s+)/g, ` $1(\n$2${comment}\n$2`)
            // don't collapse array definition if multiline
            .replaceAll(/ \[\n(\s+)/g, ` [\n$1${comment}\n$1`)
    )
}

const writeFileOrig = fs.writeFile
fs.writeFile = async (path, code, ...args) => {
    if (!path.toString().endsWith('.js')) {
        return writeFileOrig(path, code, ...args)
    }

    const cleanCode = code.replaceAll(new RegExp(`\\n\\s+${comment}\\n`, 'gm'), '\n')
    return writeFileOrig(path, cleanCode, ...args)
}

// eslint-disable-next-line import/no-extraneous-dependencies
require('prettier/bin/prettier.cjs')
