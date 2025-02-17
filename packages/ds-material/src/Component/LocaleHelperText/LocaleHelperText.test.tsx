import React from 'react'
import { it, expect, describe } from '@jest/globals'
import { render } from '@testing-library/react'
// @ts-ignore
import { toBeInTheDocument, toHaveClass } from '@testing-library/jest-dom/matchers'
import { createMap, createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap/createMap'
import { ValidityHelperText } from './LocaleHelperText'
import { createValidatorErrors } from '@ui-schema/ui-schema'
import { Map } from 'immutable'
import { MockSchemaMetaProvider } from '../../../tests/MockSchemaProvider.mock'

expect.extend({toBeInTheDocument, toHaveClass})

describe('LocaleHelperText', () => {
    it('ValidityHelperText', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                <ValidityHelperText
                    schema={createOrderedMap({type: 'string', widget: 'Text'})}
                    errors={createValidatorErrors().addError('demo-err', Map({dummy: true}))}
                    showValidity
                />
            </MockSchemaMetaProvider>
        )
        expect(queryByText('error.demo-err') !== null).toBeTruthy()
    })
    it('ValidityHelperText no err', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                <ValidityHelperText
                    schema={createOrderedMap({type: 'string', widget: 'Text'})}
                    errors={createValidatorErrors().addError('demo-err', createMap({dummy: true}))}
                    showValidity={false}
                />
            </MockSchemaMetaProvider>
        )
        expect(queryByText('browser-error') === null).toBeTruthy()
    })
    it('ValidityHelperText browser', () => {
        const {queryByText} = render(
            <MockSchemaMetaProvider>
                {/* @ts-ignore */}
                <ValidityHelperText
                    schema={createOrderedMap({t: 'browser'})}
                    browserError={<span>browser-error</span>}
                />
            </MockSchemaMetaProvider>
        )
        // expect(container.firstChild).toMatchSnapshot()
        expect(queryByText('browser-error') !== null).toBeTruthy()
    })
})
