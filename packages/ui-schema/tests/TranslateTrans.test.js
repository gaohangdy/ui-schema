import React from 'react';
import {it, expect, describe, test} from '@jest/globals';
import {render} from '@testing-library/react';
import {
    toBeInTheDocument,
    toHaveClass,
} from '@testing-library/jest-dom/matchers'
import {Trans} from '../src/Translate/Trans/Trans';
import {createMap} from '../src/Utils/createMap';
import {makeTranslator} from '../src/Translate/makeTranslator';
import {Map} from 'immutable';
import {ERROR_MIN_LENGTH} from '@ui-schema/ui-schema/Validators';

expect.extend({toBeInTheDocument, toHaveClass})

const dicEN = createMap({
    titles: {
        'simple-number': 'Simple Number',
    },
    error: {
        [ERROR_MIN_LENGTH]: (context) => `Min. Length: ${typeof context.get('min') !== 'undefined' ? context.get('min') : '-'}`,
    },
});

const tEN = makeTranslator(dicEN, 'en');

describe('Translate\\Trans', () => {
    it('Text', async () => {
        const {findByText, queryByText} = render(
            <Trans text={'titles.simple-number'} t={tEN}/>,
        );
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Simple Number');
        expect(label).toBeInTheDocument();
        expect(queryByText('titles.simple-number')).toBeNull();
    });

    test('Function', async () => {
        const {findByText, queryByText} = render(
            <Trans text={'error.' + ERROR_MIN_LENGTH} context={Map({min: 2})} t={tEN}/>,
        );
        //expect(container.firstChild).toMatchSnapshot();
        const label = await findByText('Min. Length: 2');
        expect(label).toBeInTheDocument();
        expect(queryByText('error.' + ERROR_MIN_LENGTH)).toBeNull();
    });
});
