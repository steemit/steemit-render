import 'mocha'
import * as assert from 'assert'

import {sanitize} from '../src/'

describe('Sanitizer', function() {

    it('should sanitize', async function() {
        const dirty = '<b class="boring">Hi! <script>alert("hax")</script></b>'
        assert.equal(sanitize(dirty), '<b>Hi! </b>')
    })

})
