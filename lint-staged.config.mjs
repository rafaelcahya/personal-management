// Chunk files to stay under Windows cmd.exe 8191-char CLI limit
const chunk = (arr, size) => Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))

export default {
  '*.{js,jsx}': (filenames) => chunk(filenames, 30).flatMap((files) => [
    `eslint --fix ${files.join(' ')}`,
    `prettier --write ${files.join(' ')}`,
  ]),
  '*.{json,css,md,yaml,yml}': (filenames) => chunk(filenames, 30).map((files) =>
    `prettier --write ${files.join(' ')}`
  ),
}
