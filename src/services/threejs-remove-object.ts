import _ from "lodash"

export const removeObject = (object: any) => {
    if (object.children.length > 0) {
        _.remove(object.children, childObject => {
            return removeObject(childObject)
        })
    }

    if (object.geometry && object.geometry.dispose) {
        object.geometry.dispose()
    }

    if (object.dispose) {
        object.dispose()
    }
    return true
}

export default removeObject