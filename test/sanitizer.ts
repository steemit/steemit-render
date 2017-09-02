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

    it('should strip img tag with onerror', async function() {
        const dirty = '<img src=1 href=1 onerror="javascript:alert(1)"></img>'
	assert.equal(sanitize(dirty),'<img src="brokenimg.jpg" />')
    })
    
    it('should strip audio tag with onerror', async function() {
        const dirty = '<audio src=1 href=1 onerror="javascript:alert(1)"></audio>'
	assert.equal(sanitize(dirty),'')
    })
    
    it('should strip commented script tag', async function() {
        const dirty = '<!--\x3E<img src=xxx:x onerror=javascript:alert(1)> -->'
	assert.equal(sanitize(dirty),'')
    })

    it('should strip link to javascript', async function() {
        const dirty = '<a href="javascript\x3Ajavascript:alert(1)" id="fuzzelement1">test</a>'
	assert.equal(sanitize(dirty),'<a rel="noopener">test</a>')
    })
})
