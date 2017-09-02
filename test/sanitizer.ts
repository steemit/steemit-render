import 'mocha'
import * as assert from 'assert'

import {sanitize} from '../src/'

describe('Sanitizer', function() {

    it('should basic sanitize', async function() {
        const dirty = '<b class="boring">Hi! <script>alert("hax")</script></b>'
        assert.equal(sanitize(dirty), '<b>Hi! </b>')
    })


    it('should strip script tag with hex space', async function() {
        const dirty = '<script\x20type="text/javascript">javascript:alert(1);</script>'
        assert.equal(sanitize(dirty),'')
    })

    it('should strip script tag with fake close', async function() {
        const dirty = '\'`"><\x3Cscript>javascript:alert(1)</script>'
        assert.equal(sanitize(dirty).indexOf('script'),-1)
    })
})
