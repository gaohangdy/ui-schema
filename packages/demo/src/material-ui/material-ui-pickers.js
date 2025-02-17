import React from 'react';
import AppTheme from './layout/AppTheme';
import Dashboard from './dashboard/Dashboard';
import Grid from '@material-ui/core/Grid';
import {MuiPickersUtilsProvider} from '@material-ui/pickers';
import {widgets} from '@ui-schema/ds-material';
import {TimePicker, DatePicker, DateTimePicker} from '@ui-schema/material-pickers';
import {DummyRenderer} from './component/MuiMainDummy';
import {schemaDatePickers} from '../schemas/demoDatePickers';
import {useDummy} from '../component/MainDummy';
import LuxonAdapter from '@date-io/luxon';
import {browserT} from '../t';
import {UIMetaProvider} from '@ui-schema/ui-schema';

const customWidgets = {...widgets};
customWidgets.custom = {
    ...widgets.custom,
    DateTime: DateTimePicker,
    Date: DatePicker,
    Time: TimePicker,
};

const Main = ({classes = {}}) => {
    const {toggleDummy, getDummy} = useDummy();

    return <React.Fragment>
        <Grid item xs={12}>
            <DummyRenderer id={'schemaDateTimePickers'} open schema={schemaDatePickers} toggleDummy={toggleDummy} getDummy={getDummy} classes={classes}/>
        </Grid>
    </React.Fragment>
};

export default () => <AppTheme>
    <UIMetaProvider widgets={customWidgets} t={browserT}>
        <MuiPickersUtilsProvider utils={LuxonAdapter}>
            <Dashboard main={Main}/>
        </MuiPickersUtilsProvider>
    </UIMetaProvider>
</AppTheme>
