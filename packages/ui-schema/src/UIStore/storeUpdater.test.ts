/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import {
    toBeInTheDocument,
    toHaveClass,
    // @ts-ignore
} from '@testing-library/jest-dom/matchers'
import { List, Map, OrderedMap } from 'immutable'
import { UIStore, storeUpdater, StoreKeys, UIStoreType, UIStoreUpdaterFn, UIStoreUpdaterData, UIStoreActionUpdate } from '@ui-schema/ui-schema/UIStore'

expect.extend({toBeInTheDocument, toHaveClass})

describe('storeUpdater', () => {
    test.each([
        [
            new UIStore({
                values: OrderedMap({}),
            }),
            List([]),
            ['value'],
            ({value}) => ({value}),
            undefined,
            undefined,
            new UIStore({
                values: OrderedMap({}),
            }),
        ], [
            new UIStore({
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
            }),
            List(['prop_a']),
            ['value'],
            ({value}) => ({value: value + '--modified'}),
            undefined,
            undefined,
            new UIStore({
                values: OrderedMap({
                    prop_a: 'some-string--modified',
                }),
            }),
        ], [
            new UIStore({// initial store
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
            }),
            List(['prop_a']),// storeKeys
            ['value'],// scopes
            () => ({value: ''}),
            true,// deleteOnEmpty
            'string',// type
            new UIStore({// expected
                values: OrderedMap({}),
            }),
        ], [
            new UIStore({// initial store
                values: OrderedMap({
                    prop_a: 'some-string',
                }),
                internals: Map({}),
            }),
            List(['prop_a']),// storeKeys
            ['value', 'internal', 'valid'],// scopes
            ({value, internal = Map({})}) => ({
                value: value + '--modified',
                internal: internal.set('value', 'some-state'),
                valid: true,
            }),
            undefined,// deleteOnEmpty
            undefined,// type
            new UIStore({// expected
                values: OrderedMap({
                    prop_a: 'some-string--modified',
                }),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            value: 'some-state',
                        }),
                    }),
                }),
                validity: Map({
                    prop_a: Map({
                        __valid: true,
                    }),
                }),
            }),
        ],
    ] as [
        UIStoreType,
        StoreKeys,
        (keyof UIStoreUpdaterData)[],
        UIStoreUpdaterFn,
            boolean | undefined,
            string | undefined,
        UIStoreType
    ][])('storeUpdater %j, %j', (
        store: UIStoreType,
        storeKeys: StoreKeys,
        scopes: (keyof UIStoreUpdaterData)[],
        updater: UIStoreUpdaterFn,
        deleteOnEmpty: boolean | undefined,
        type: string | undefined,
        expected: UIStoreType
    ) => {
        const action: UIStoreActionUpdate = {
            type: 'update',
            updater: updater,
            ...(type ? {schema: Map({type})} : {}),
            ...(deleteOnEmpty ? {required: true} : {}),
        }
        const r = storeUpdater(storeKeys, scopes, action)(store)
        const isExpected = r.equals(expected)
        if (!isExpected) {
            console.log(
                'failed storeUpdater', storeKeys.toJS(), scopes,
                JSON.stringify(store.toJS(), undefined, 2),
                JSON.stringify(r?.toJS(), undefined, 2),
                JSON.stringify(expected?.toJS(), undefined, 2)
            )
        }
        expect(isExpected).toBe(true)
    })
})
