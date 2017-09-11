export declare const noImageText = "(Image not shown due to low ratings)";
export declare const allowedTags: string[];
declare const _default: ({large, highQualityPost, noImage, sanitizeErrors}: {
    large?: boolean;
    highQualityPost?: boolean;
    noImage?: boolean;
    sanitizeErrors?: string[];
}) => {
    allowedTags: string[];
    allowedAttributes: {
        iframe: string[];
        div: string[];
        td: string[];
        img: string[];
        a: string[];
    };
    transformTags: {
        iframe: (tagName: any, attribs: any) => {
            tagName: string;
            attribs: {
                frameborder: string;
                allowfullscreen: string;
                webkitallowfullscreen: string;
                mozallowfullscreen: string;
                src: any;
                width: string;
                height: string;
            };
        } | {
            tagName: string;
            text: string;
        };
        img: (tagName: any, attribs: any) => {
            tagName: string;
            text: string;
        } | {
            tagName: any;
            attribs: any;
        };
        div: (tagName: any, attribs: any) => {
            tagName: any;
            attribs: any;
        };
        td: (tagName: any, attribs: any) => {
            tagName: any;
            attribs: any;
        };
        a: (tagName: any, attribs: any) => {
            tagName: any;
            attribs: any;
        };
    };
};
export default _default;
