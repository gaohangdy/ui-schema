import { prependKey, shouldDeleteOnEmpty, StoreKeys, UIStoreActionUpdate } from '@ui-schema/ui-schema/UIStore/UIStore'
import { ScopeOnChangeHandler } from '@ui-schema/ui-schema/UIStore/storeUpdater'
import { List, Map } from 'immutable'
import { updateStoreScope } from '@ui-schema/ui-schema/UIStore/updateStoreScope'
import { storeBuildScopeTree } from '@ui-schema/ui-schema/UIStore/storeBuildScopeTree'
import { SchemaTypesType } from '@ui-schema/ui-schema'

export const scopeUpdaterValues: ScopeOnChangeHandler = (store, storeKeys, oldValue, newValue, action) => {
    if (typeof oldValue === 'undefined') {
        // initializing the tree for correct data types
        // https://github.com/ui-schema/ui-schema/issues/119
        store = storeBuildScopeTree(storeKeys, 'values', store, undefined, true)
    }
    // todo: the decision for `should delete` should only come from "value", and then used by e.g. internalValue/validity updates,
    //       but also some internal values must be preserved, like `is default handled`, `richtext editor state`
    // todo: also, actually, it must be checked & deleted recursively
    if (shouldDeleteOnEmpty(newValue, action?.schema?.get('deleteOnEmpty') as boolean || (action as UIStoreActionUpdate)?.required, action?.schema?.get('type') as SchemaTypesType)) {
        if (storeKeys.size) {
            const parentStore = store.getIn(prependKey(storeKeys.splice(storeKeys.size - 1, 1) as StoreKeys, 'values'))
            // e.g. numbers in tuples must only be deleted, when it is inside an object, when inside an `list` undefined must be used for a "reset"
            // todo: support valueOnDelete and fix behaviour in Array tuples https://github.com/ui-schema/ui-schema/issues/106
            //       also tests are missing atm.
            if (List.isList(parentStore)) {
                store = store.setIn(prependKey(storeKeys, 'values'), null)
            } else if (Map.isMap(parentStore)) {
                store = store.deleteIn(prependKey(storeKeys, 'values'))
            }
        } else {
            store = store.deleteIn(['values'])
        }
        return store
    }

    // todo: when parent is a `list`, check if "all other array items exist" - and when not, fill them with e.g. `null`

    return updateStoreScope(
        store, 'values', storeKeys,
        newValue
    )
}
