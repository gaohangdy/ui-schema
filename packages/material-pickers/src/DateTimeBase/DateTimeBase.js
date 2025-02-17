import React from 'react';
import {beautifyKey} from '@ui-schema/ui-schema';
import {useUID} from 'react-uid';
import {useUtils} from '@material-ui/pickers';
import {List} from 'immutable';

function fromSeconds(secs) {
    return new Date(Number(secs) * 1000);
}

export const DateTimeBase = ({
                                 storeKeys, ownKey, value, onChange, schema,
                                 showValidity, valid, /*errors,*/
                                 required,
                                 additionalProps = {}, dateFormat, dateFormatData,
                                 Component, keyboard,
                             }) => {
    const date = useUtils();
    const uid = useUID();

    let views = schema.getIn(['date', 'views']);
    if(List.isList(views)) {
        views = views.toArray();
    }

    if(!keyboard) {
        if(schema.getIn(['date', 'clearable'])) {
            additionalProps['clearable'] = true;
        }
    }

    const justify = schema.getIn(['view', 'justify']);

    return <div style={{
        display: 'flex',
        justifyContent: justify === 'left' ? 'flex-start' :
            justify === 'right' ? 'flex-end' : 'center',
    }}><Component
        error={!valid && showValidity}
        required={required}
        id={'uis-' + uid}
        views={views}
        format={dateFormat}
        fullWidth
        label={beautifyKey(ownKey, schema.get('tt'))}
        margin={schema.getIn(['view', 'dense'])}
        disableToolbar={schema.getIn(['date', 'toolbar']) !== true}
        autoOk={schema.getIn(['date', 'autoOk']) !== false}
        variant={schema.getIn(['date', 'variant'])}
        minDate={schema.getIn(['date', 'minDate']) ?
            date.date(schema.getIn(['date', 'minDate'])) : undefined}
        maxDate={schema.getIn(['date', 'maxDate']) ?
            date.date(schema.getIn(['date', 'maxDate'])) : undefined}
        openTo={schema.getIn(['date', 'openTo'])}
        disableFuture={schema.getIn(['date', 'disableFuture'])}
        disablePast={schema.getIn(['date', 'disablePast'])}
        value={value ?
            value === 'now' ? date.date() :
                dateFormatData === 'X' ? fromSeconds(value) :
                    dateFormatData === 'x' ? fromSeconds(value / 1000) :
                        date.parse(value, dateFormatData)
            : null}
        onChange={(e) => {
            onChange(
                storeKeys, ['value'],
                {
                    type: 'update',
                    updater: () => ({value: e ? date.format(e, dateFormatData) : ''}),
                    schema,
                    required,
                },
            )
        }}
        {...additionalProps}
    /></div>
};
