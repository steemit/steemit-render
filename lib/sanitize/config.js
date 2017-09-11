"use strict";
/* tslint:disable:max-line-length prefer-const curly */
Object.defineProperty(exports, "__esModule", { value: true });
var iframeWhitelist = [
    {
        re: /^(https?:)?\/\/player.vimeo.com\/video\/.*/i,
        fn: function (src) {
            // <iframe src="https://player.vimeo.com/video/179213493" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
            if (!src) {
                return null;
            }
            var m = src.match(/https:\/\/player\.vimeo\.com\/video\/([0-9]+)/);
            if (!m || m.length !== 2) {
                return null;
            }
            return 'https://player.vimeo.com/video/' + m[1];
        },
    },
    { re: /^(https?:)?\/\/www.youtube.com\/embed\/.*/i,
        fn: function (src) {
            return src.replace(/\?.+$/, ''); // strip query string (yt: autoplay=1,controls=0,showinfo=0, etc)
        },
    },
    {
        re: /^https:\/\/w.soundcloud.com\/player\/.*/i,
        fn: function (src) {
            if (!src)
                return null;
            // tslint:ignore-next
            // <iframe width="100%" height="450" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/257659076&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true"></iframe>
            var m = src.match(/url=(.+?)&/);
            if (!m || m.length !== 2)
                return null;
            return 'https://w.soundcloud.com/player/?url=' + m[1] +
                '&auto_play=false&hide_related=false&show_comments=true' +
                '&show_user=true&show_reposts=false&visual=true';
        },
    },
];
exports.noImageText = '(Image not shown due to low ratings)';
exports.allowedTags = "\n    div, iframe, del,\n    a, p, b, i, q, br, ul, li, ol, img, h1, h2, h3, h4, h5, h6, hr,\n    blockquote, pre, code, em, strong, center, table, thead, tbody, tr, th, td,\n    strike, sup, sub\n".trim().split(/,\s*/);
// Medium insert plugin uses: div, figure, figcaption, iframe
exports.default = function (_a) {
    var _b = _a.large, large = _b === void 0 ? true : _b, _c = _a.highQualityPost, highQualityPost = _c === void 0 ? true : _c, _d = _a.noImage, noImage = _d === void 0 ? false : _d, _e = _a.sanitizeErrors, sanitizeErrors = _e === void 0 ? Array() : _e;
    return ({
        allowedTags: exports.allowedTags,
        // figure, figcaption,
        // SEE https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
        allowedAttributes: {
            // "src" MUST pass a whitelist (below)
            iframe: ['src', 'width', 'height', 'frameborder', 'allowfullscreen',
                'webkitallowfullscreen', 'mozallowfullscreen'],
            // class attribute is strictly whitelisted (below)
            div: ['class'],
            // style is subject to attack, filtering more below
            td: ['style'],
            img: ['src', 'alt'],
            a: ['href', 'rel'],
        },
        transformTags: {
            iframe: function (tagName, attribs) {
                var srcAtty = attribs.src;
                for (var _i = 0, iframeWhitelist_1 = iframeWhitelist; _i < iframeWhitelist_1.length; _i++) {
                    var item = iframeWhitelist_1[_i];
                    if (item.re.test(srcAtty)) {
                        var src = typeof item.fn === 'function' ? item.fn(srcAtty) : srcAtty;
                        if (!src)
                            break;
                        return {
                            tagName: 'iframe',
                            attribs: {
                                frameborder: '0',
                                allowfullscreen: 'allowfullscreen',
                                webkitallowfullscreen: 'webkitallowfullscreen',
                                mozallowfullscreen: 'mozallowfullscreen',
                                src: src,
                                width: large ? '640' : '480',
                                height: large ? '360' : '270',
                            },
                        };
                    }
                }
                // console.log('Blocked, did not match iframe "src" white list urls:', tagName, attribs)
                sanitizeErrors.push('Invalid iframe URL: ' + srcAtty);
                return { tagName: 'div', text: "(Unsupported " + srcAtty + ")" };
            },
            img: function (tagName, attribs) {
                if (noImage)
                    return { tagName: 'div', text: exports.noImageText };
                // See https://github.com/punkave/sanitize-html/issues/117
                var src = attribs.src, alt = attribs.alt;
                if (!/^(https?:)?\/\//i.test(src)) {
                    // console.log('Blocked, image tag src does not appear to be a url', tagName, attribs)
                    sanitizeErrors.push('An image in this post did not save properly.');
                    return { tagName: 'img', attribs: { src: 'brokenimg.jpg' } };
                }
                // replace http:// with // to force https when needed
                src = src.replace(/^http:\/\//i, '//');
                var atts = { src: src };
                if (alt && alt !== '')
                    atts.alt = alt;
                return { tagName: tagName, attribs: atts };
            },
            div: function (tagName, attribs) {
                var attys = {};
                var classWhitelist = ['pull-right', 'pull-left', 'text-justify', 'text-rtl', 'text-center', 'text-right', 'videoWrapper'];
                var validClass = classWhitelist.find(function (e) { return attribs.class === e; });
                if (validClass)
                    attys.class = validClass;
                return {
                    tagName: tagName,
                    attribs: attys,
                };
            },
            td: function (tagName, attribs) {
                var attys = {};
                if (attribs.style === 'text-align:right')
                    attys.style = 'text-align:right';
                return {
                    tagName: tagName,
                    attribs: attys,
                };
            },
            a: function (tagName, attribs) {
                var href = attribs.href;
                if (!href)
                    href = '#';
                href = href.trim();
                var attys = { href: href };
                // If it's not a (relative or absolute) steemit URL...
                if (!href.match(/^(\/(?!\/)|https:\/\/steemit.com)/)) {
                    // attys.target = '_blank' // pending iframe impl https://mathiasbynens.github.io/rel-noopener/
                    attys.rel = highQualityPost ? 'noopener' : 'nofollow noopener';
                }
                return {
                    tagName: tagName,
                    attribs: attys,
                };
            },
        },
    });
};
