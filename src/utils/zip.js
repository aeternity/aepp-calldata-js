module.exports = (arr, ...arrs) => {
    return arr.map((val, i) => arrs.reduce((a, curr) => [...a, curr[i]], [val]))
}
