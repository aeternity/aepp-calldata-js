const Variant = (ctor, ...args) => {
    return {[ctor]: args}
}

const Some = (args) => {
    return Variant('Some', args)
}

const None = () => {
    return Variant('None')
}

module.exports = {
    Variant,
    Some,
    None
}
