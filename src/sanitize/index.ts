import * as sanitizeHtml from 'sanitize-html'
import sanitizeConfig from './config'

export function sanitize(dirty: string, options = {}) {
    const conf = sanitizeConfig(options) as any
    const clean = sanitizeHtml(dirty, conf)
    if (/<\s*script/ig.test(clean)) {
        // Not meant to be complete checking, just a secondary trap and red flag (code can change)
        return ''
    }
    return clean
}
