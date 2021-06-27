import { onChange, OwnKey, StoreKeys, UIStoreContext } from '@ui-schema/ui-schema/UIStore'
import { Errors, required, valid, StoreSchemaType } from './CommonTypings'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'

export interface WidgetProps {
    onChange: onChange
    schema: StoreSchemaType
    parentSchema: StoreSchemaType
    // the current level in the schema, e.g. `0` for root, `1` for the first properties
    level: number
    // the last index of the current widget
    ownKey: OwnKey
    // all indices of the current widget
    storeKeys: StoreKeys
    // if the widget should show the validity
    showValidity: UIStoreContext['showValidity']
    errors: Errors
    required: required
    valid: valid
    // specifying hidden inputs / virtual lists etc.
    isVirtual?: boolean
    // either from `UIMetaProvider` or overriden from within a parent widget/plugin
    widgets: WidgetsBindingBase
    // contains the value for non-scalar items, for objects/array it is undefined
    value: string | number | boolean | undefined | null
}
