import React from 'react'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { List } from 'immutable'
import { onErrors } from '@ui-schema/ui-schema/ValidatorErrors'

export interface PluginProps<C extends {} = {}> extends WidgetProps<C> {
    // must be transformed from list to boolean `required` by a plugin
    requiredList?: List<any>
    // current number of plugin in the stack
    currentPluginIndex: number

    // listen from a hoisted component for `errors` changing,
    // useful for some performance optimizes like at ds-material Accordions
    // is executed in `WidgetRenderer`, not passed down to widget
    onErrors?: onErrors
}

export type ComponentPluginType<C extends {} = {}> = React.ComponentType<PluginProps<C>>
export type PluginType = ComponentPluginType

export function PluginComponent<P extends PluginProps>(props: P): React.ReactElement<P>
