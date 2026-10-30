<?php

namespace App\Support;

use Symfony\Component\HtmlSanitizer\HtmlSanitizer;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerAction;
use Symfony\Component\HtmlSanitizer\HtmlSanitizerConfig;

/** Allow-list for blog HTML produced by the rich text editor. */
class BlogHtmlSanitizer
{
    public const MAX_LENGTH = 200000;

    private const TEXT_ELEMENTS = [
        'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'strong', 'b', 'em', 'i', 'u', 's',
        'strike', 'sub', 'sup', 'blockquote', 'ul', 'ol', 'li', 'pre', 'code',
    ];

    /** Wrappers removed while keeping their (sanitized) text; anything else unknown is dropped. */
    private const UNWRAPPED_ELEMENTS = [
        'span', 'div', 'font', 'section', 'article', 'header', 'footer', 'main', 'aside', 'figure',
        'figcaption', 'small', 'mark', 'abbr', 'cite', 'q', 'del', 'ins', 'kbd', 'samp', 'var', 'time',
        'center', 'big', 'tt', 'table', 'caption', 'thead', 'tbody', 'tfoot', 'tr', 'td', 'th',
    ];

    private static ?HtmlSanitizer $sanitizer = null;

    public static function clean(?string $html): string
    {
        return self::sanitizer()->sanitize((string) $html);
    }

    private static function sanitizer(): HtmlSanitizer
    {
        if (self::$sanitizer) {
            return self::$sanitizer;
        }

        $config = (new HtmlSanitizerConfig)
            ->defaultAction(HtmlSanitizerAction::Drop)
            ->withMaxInputLength(self::MAX_LENGTH)
            ->allowLinkSchemes(['http', 'https', 'mailto', 'tel'])
            ->allowRelativeLinks()
            ->allowMediaSchemes(['http', 'https'])
            ->allowRelativeMedias()
            ->allowElement('a', ['href', 'title', 'target'])
            ->forceAttribute('a', 'rel', 'noopener noreferrer')
            ->allowElement('img', ['src', 'alt', 'title', 'width', 'height']);

        foreach (self::TEXT_ELEMENTS as $element) {
            $config = $config->allowElement($element);
        }
        foreach (self::UNWRAPPED_ELEMENTS as $element) {
            $config = $config->blockElement($element);
        }

        return self::$sanitizer = new HtmlSanitizer($config);
    }
}
