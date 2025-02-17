/**
 * @jest-environment jsdom
 */
import { test, expect, describe } from '@jest/globals'
import {
    toBeInTheDocument,
    toHaveClass,
    // @ts-ignore
} from '@testing-library/jest-dom/matchers'
import { List, Map } from 'immutable'
import { UIStore, createStore, StoreKeys, UIStoreType } from '@ui-schema/ui-schema/UIStore'
import { doExtractValue } from '@ui-schema/ui-schema/UIStore'
import { isEqual } from '@ui-schema/ui-schema/Utils/memo'
import { fromJSOrdered } from '@ui-schema/ui-schema/Utils/createMap'

expect.extend({toBeInTheDocument, toHaveClass})

describe('UIStoreProvider', () => {
    test.each([
        [
            List([]),
            createStore(Map({})),
            {
                value: Map(),
                internalValue: Map({
                    internals: Map(),
                }),
            },
            true,
        ], [
            List([]),
            createStore(List([])),
            {
                value: List(),
                internalValue: Map({
                    internals: List(),
                }),
            },
            true,
        ], [
            List(['prop_a']),
            createStore(fromJSOrdered({prop_a: 20})),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List([0]),
            createStore(fromJSOrdered([20])),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 'prop_0']),
            createStore(fromJSOrdered({prop_a: {prop_0: 20}})),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 'prop_1']),
            createStore(fromJSOrdered({prop_a: {prop_0: 20}})),
            {
                value: undefined,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 0]),
            createStore(fromJSOrdered({prop_a: [20]})),
            {
                value: 20,
                internalValue: Map(),
            },
            true,
        ], [
            List(['prop_a', 0]),
            new UIStore({
                values: fromJSOrdered({prop_a: [20]}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            internals: List([
                                Map({
                                    internals: Map(),
                                }),
                            ]),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            {
                value: 20,
                internalValue: Map({
                    internals: Map(),
                }),
            },
            true,
        ], [
            List(['prop_a']),
            new UIStore({
                values: fromJSOrdered({prop_a: 20}),
                internals: Map({
                    internals: Map({
                        prop_a: Map({
                            someValue: true,
                            internals: Map(),
                        }),
                    }),
                }),
                validity: Map({}),
            }),
            {
                value: 20,
                internalValue: Map({
                    someValue: true,
                    internals: Map(),
                }),
            },
            true,
        ],
    ])('doExtractValue(%j, %j): %j', (storeKeys: StoreKeys, store: UIStoreType, expected: any, expectedSameness: boolean) => {
        const r = doExtractValue(storeKeys, store)
        const isExpected = isEqual(r, expected)
        if (isExpected !== expectedSameness) {
            // @ts-ignore
            console.log('failed doExtractValue', storeKeys.toJS(), store.toJS(), r, expected)
        }
        expect(isExpected).toBe(expectedSameness)
    })
})
