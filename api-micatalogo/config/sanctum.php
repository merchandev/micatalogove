<?php

// Only the keys that differ from Sanctum's defaults; the package merges the rest.
return [
    // Personal access tokens expire after this many minutes (default: 7 days). 0 disables expiry.
    'expiration' => ((int) env('SANCTUM_EXPIRATION', 10080)) ?: null,
];
