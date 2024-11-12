import InternalError from '../Errors/InternalError.js'

const assert = (condition, message) => {
    if (!condition) {
        throw new InternalError(message)
    }
}

export default assert
