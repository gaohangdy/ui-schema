import React from 'react';
import {Typography} from '@material-ui/core';
import Loadable from 'react-loadable';
import {Markdown as MarkdownBase, allowHtml} from '@control-ui/docs/Markdown/Markdown'
import {renderers as baseRenderers} from '@control-ui/docs/Markdown/MarkdownRenderers'
import {MdInlineCode} from '@control-ui/docs/Markdown/InlineCode';
import {MdLink} from '@control-ui/docs/Markdown/Link';
import {LinkableHeadline} from '@control-ui/docs/LinkableHeadline';
import {LoadingCircular} from '@control-ui/kit/Loading/LoadingCircular';

const Code = Loadable({
    loader: () => import('./MarkdownCode'),
    loading: () => <LoadingCircular title={'Loading Web-IDE'}/>,
});

const LinkInternalLocale = (p) => {
    return <MdLink {...p} href={0 !== p.href.indexOf('#') && -1 === p.href.indexOf('https://') && -1 === p.href.indexOf('http://') ? p.href.substr(1) : p.href}/>
};

// see: https://github.com/rexxars/react-markdown#node-types
const renderers = baseRenderers(true);
renderers.paragraph = p => <Typography {...p} component={'p'} variant={'body2'} gutterBottom/>;
renderers.inlineCode = p => <MdInlineCode variant={'body1'} {...p}/>;
renderers.code = p => <Code variant={'body2'} {...p}/>;
renderers.heading = ({level, ...p}) => <Typography {...p} component={'h' + (level + 1)} variant={'subtitle' + (level)} style={{textDecoration: 'underline', marginTop: 48 / level}} gutterBottom/>;
renderers.listItem = p => <Typography component={'li'} variant={'body2'} style={{fontWeight: 'bold'}}><span style={{fontWeight: 'normal', display: 'block'}}>{p.children}</span></Typography>;
renderers.link = LinkInternalLocale;

const renderersContent = baseRenderers(false);
renderersContent.code = p => <Code variant={'body1'} {...p}/>;
renderersContent.inlineCode = p => <MdInlineCode variant={'body1'} {...p}/>;
renderersContent.heading = LinkableHeadline;
renderersContent.link = LinkInternalLocale;

const astPlugins = [allowHtml()];
const Markdown = ({source, content = false}) =>
    <MarkdownBase source={source} astPlugins={astPlugins} renderers={content ? renderersContent : renderers}/>;

export {Markdown}
