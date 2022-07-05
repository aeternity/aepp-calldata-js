module.exports = function isOptionVariant({ name, variants }) {
    return name === 'variant'
        && variants.some(({ None }) => None && None.length === 0)
        && variants.some(({ Some }) => Some)
}
