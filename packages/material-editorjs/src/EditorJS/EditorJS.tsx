import React from 'react'
import ReactEditorJs from 'react-editor-js'
import EditorJSType, { API, OutputData, EditorConfig } from '@editorjs/editorjs'
import { onChangeHandler, StoreKeys, UIStoreInternalsType } from '@ui-schema/ui-schema'
import { extractValue } from '@ui-schema/ui-schema/UIStore'
import { List, Map, OrderedMap } from 'immutable'
import { fromJSOrdered } from '@ui-schema/ui-schema/Utils/createMap/createMap'

export interface EditorJSProps {
    uid: string
    onFocus?: () => void
    onBlur?: () => void
    onReady?: () => void
    onEmptyChange: (empty: boolean) => void
    ready?: boolean
    onChange: onChangeHandler
    storeKeys: StoreKeys
    required?: boolean
    internalValue: UIStoreInternalsType
    value?: OrderedMap<'time' | 'blocks' | 'version', any>
    tools: EditorConfig['tools']
}

const EditorJSBase: React.ComponentType<EditorJSProps> = (
    {
        uid,
        onFocus,
        onBlur,
        onReady,
        ready,
        onChange,
        storeKeys,
        required,
        value,
        internalValue,
        onEmptyChange,
        tools,
    }
) => {
    const editorRef = React.useRef<EditorJSType>()
    const currentState = React.useRef<OrderedMap<any, any> | undefined>(undefined)
    const onChangeEditor = React.useCallback((_api: API, newData?: OutputData) => {
        const newValue = fromJSOrdered(newData) as OrderedMap<any, any>
        if (!currentState.current?.get('blocks')?.equals(newValue?.get('blocks'))) {
            onChange(
                storeKeys, ['value', 'internal'],
                {
                    type: 'update',
                    updater: ({internal: currentInternal = Map()}) => {
                        currentState.current = newValue
                        return {
                            value: currentState.current,
                            internal: currentInternal.set('isEmpty', Boolean(!(currentState.current?.get('blocks')?.size > 0))),
                        }
                    },
                    schema: Map({type: 'object'}),
                    required,
                }
            )
        }
    }, [onChange, storeKeys, required, currentState])

    const isEmpty = internalValue.get('isEmpty') || !(value?.get('blocks')?.size > 0)

    React.useEffect(() => {
        if (
            // init only when ready and editor ref
            ready && editorRef.current &&
            (
                // and either
                // a) a value is set, but not the same values blocks are already set
                (value && !currentState.current?.get('blocks')?.equals(value?.get('blocks'))) ||
                // b) no value is set, but some value is already set - but the already set value is not "empty" / not without blocks
                (!value && currentState.current && !currentState.current?.get('blocks').equals(List()))
            )
        ) {
            editorRef.current.clear()
            if (value) {
                currentState.current = value
                editorRef.current.render(value.toJS())
            } else {
                currentState.current = fromJSOrdered({
                    blocks: [],
                }) as OrderedMap<any, any>
            }
            onChange(
                storeKeys, ['internal'],
                {
                    type: 'update',
                    updater: ({internal: currentInternal = Map()}) => ({
                        internal: currentInternal.set('isEmpty', Boolean(!(value?.get('blocks')?.size > 0))),
                    }),
                    schema: Map({type: 'object'}),
                    required,
                }
            )
        }
    }, [value, ready, editorRef, currentState, isEmpty, onEmptyChange])

    React.useEffect(() => {
        onEmptyChange(Boolean(typeof isEmpty === 'undefined' ? true : isEmpty))
    }, [isEmpty, onEmptyChange])

    return <ReactEditorJs
        data={undefined}
        tools={tools}
        instanceRef={instance => editorRef.current = instance}
        enableReInitialize={false}
        onReady={onReady}
        // @ts-ignore
        onChange={onChangeEditor}
        holder={'uis-' + uid + '-editor'}
        minHeight={0}
    >
        <div
            id={'uis-' + uid + '-editor'}
            tabIndex={-1}
            onFocus={onFocus}
            onBlur={onBlur}
            style={{
                visibility: ready ? 'visible' : 'hidden',
                height: ready ? 'auto' : 0,
            }}
        />
    </ReactEditorJs>
}

export const EditorJS = extractValue(EditorJSBase)
