import 'mocha'
import * as assert from 'assert'

import {sanitize} from '../src/'

describe('Misc checks', function() {

    it('should empty iframe', async function() {
        const dirty = '<iframe></iframe>'
	assert.equal(sanitize(dirty),'<div>(Unsupported undefined)</div>')
    })

    it('should vimeo embed', async function() {
        const dirty = '<iframe src="https://player.vimeo.com/video/179213493" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'
	assert.equal(sanitize(dirty), '<iframe frameborder="0" allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen" src="https://player.vimeo.com/video/179213493" width="640" height="360"></iframe>')
    })

    it('should soundcloud embed', async function() {
        const dirty = '<iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257659076&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>'
	assert.equal(sanitize(dirty), '<iframe frameborder="0" allowfullscreen="allowfullscreen" webkitallowfullscreen="webkitallowfullscreen" mozallowfullscreen="mozallowfullscreen" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257659076&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true" width="640" height="360"></iframe>')
    })

    it('should normal img tag', async function() {
        const dirty = '<img src="http://example.com/image.jpg">'
	assert.equal(sanitize(dirty), '<img src="//example.com/image.jpg" />')
    })

})
