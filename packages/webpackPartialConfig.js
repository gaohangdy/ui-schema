
const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '@ui-schema/ui-schema': path.resolve(__dirname, './ui-schema/src'),
'@ui-schema/pro': path.resolve(__dirname, './ui-schema-pro/src'),
'@ui-schema/dictionary': path.resolve(__dirname, './dictionary/src'),
'@ui-schema/ds-material': path.resolve(__dirname, './ds-material/src'),
'@ui-schema/ds-bootstrap': path.resolve(__dirname, './ds-bootstrap/src'),
'@ui-schema/material-pickers': path.resolve(__dirname, './material-pickers/src'),
'@ui-schema/material-richtext': path.resolve(__dirname, './material-richtext/src'),
'@ui-schema/material-slate': path.resolve(__dirname, './material-slate/src'),
'@ui-schema/material-editable': path.resolve(__dirname, './material-editable/src'),
'@ui-schema/material-code': path.resolve(__dirname, './material-code/src'),
'@ui-schema/material-color': path.resolve(__dirname, './material-color/src'),
'@ui-schema/material-editorjs': path.resolve(__dirname, './material-editorjs/src'),
'@ui-schema/material-dnd': path.resolve(__dirname, './material-dnd/src'),
'@ui-schema/material-rbd': path.resolve(__dirname, './material-rbd/src'),

        }
    }
}