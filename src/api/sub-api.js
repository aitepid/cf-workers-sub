/**
 * Subscription API endpoint (/api/sub)
 */
import { parseParams } from '../subgen/parser.js';
import { formatAsSingBox } from '../subgen/singbox.js';
import { formatAsClash } from '../subgen/clash.js';
import { formatAsMixed } from '../subgen/mixed.js';

function handleSubApi(pathname, config) {
    const url = new URL(pathname, 'http://localhost');
    const params = parseParams(url.search);
    
    let content = '';
    let contentType = 'text/plain';
    
    if (params.format === 'singbox') {
        content = formatAsSingBox(config.uuid, config);
        contentType = 'application/json';
    } else if (params.format === 'clash') {
        content = formatAsClash([`${config.uuid}@${config.host}`], config);
        contentType = 'text/yaml';
    } else if (params.format === 'vless') {
        content = `vless://${config.uuid}@${config.host}:443?security=tls&type=ws&encryption=none#${encodeURI('default')}`;
    } else {
        content = formatAsMixed(config.uuid, config);
    }
    
    return new Response(content, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="config.${params.format}"`
        }
    });
}
