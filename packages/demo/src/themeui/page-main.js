import React from 'react';
import {Link} from 'react-router-dom';
import {schemaGrid} from "../schemas/demoGrid";
import {widgets,} from "@ui-schema/ds-themeui";
import {SchemaEditor, isInvalid, createOrderedMap, createStore} from "@ui-schema/ui-schema";
import {browserT} from "../t";

const MainStore = () => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [store, setStore] = React.useState(() => createStore(createOrderedMap({})));
    const [schema/*, setSchema*/] = React.useState(schemaGrid(12));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={store}
            onChange={setStore}
            widgets={widgets}
            showValidity={showValidity}
            t={browserT}
        />

        <button onClick={() => setShowValidity(!showValidity)}>validity</button>
        {isInvalid(store.getValidity()) ? 'invalid' : 'valid'}

    </React.Fragment>
};

export default () => {
    return <div style={{display: 'flex'}}>
        <ul style={{paddingRight: 16, flexShrink: 0}}>
            <li>
                <Link to={'/'}>Material</Link>
            </li>
            <li>
                <Link to={'/bootstrap'}>Bootstrap</Link>
            </li>
            <li>
                <Link to={'/blueprint'}>Blueprint</Link>
            </li>
            <li>
                <Link to={'/antd'}>AntD</Link>
            </li>
            <li>
                <Link to={'/semantic-ui'}>Semantic UI</Link>
            </li>
            <li>
                <Link to={'/theme-ui'}>Theme UI</Link>
            </li>
        </ul>
        <div style={{flexGrow: 2}}>
            <MainStore/>
        </div>
    </div>
};
