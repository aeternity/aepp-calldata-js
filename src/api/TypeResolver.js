const InternalResolver = require('../TypeResolver')

class TypeResolver {
    constructor() {
        this._internalResolver = new InternalResolver()
    }

    /**
     * Resolves ACI type format to opaque (internal) type structure
     * to allow usage of other library APIs that needs type information.
     * The opaque type shouldn't be used for anything else (including storing) than passing it
     * as library argument as its structure is not guaranteed.
     *
     * @example
     * const type = resolver.resolveType({map: ['int', 'bool']})
     * const encoded = ContractByteArrayEncoder.encode(new Map([[7n, false]]), type)
     * console.log(`Encoded data: ${encoded}`)
     * // Outputs:
     * // Encoded data: cb_LwEOfzGit9U=
     *
     * @param {object} type - The type information in ACI format
     * @param {object} vars - Additional type variables, templates etc.
     * @returns {object} Opaque type information structure
    */
    resolveType(type, vars = {}) {
        return this._internalResolver.resolveType(type, vars)
    }
}

module.exports = TypeResolver
