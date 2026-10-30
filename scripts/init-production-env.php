<?php

// Run on the target server: php scripts/init-production-env.php
// Never overwrite credentials or print them to the console.
umask(0077);
$root = dirname(__DIR__);
$contents = file_get_contents($root.'/.env.production.example');
foreach ([
    'APP_KEY' => 'base64:'.base64_encode(random_bytes(32)),
    'DB_PASSWORD' => bin2hex(random_bytes(32)),
    'MYSQL_ROOT_PASSWORD' => bin2hex(random_bytes(32)),
    'SEED_SUPERADMIN_PASSWORD' => bin2hex(random_bytes(24)),
] as $name => $value) {
    $contents = preg_replace('/^'.preg_quote($name, '/').'=$/m', $name.'='.$value, $contents);
}
$file = @fopen($root.'/.env.production', 'x');
if ($file === false) {
    fwrite(STDERR, "Cannot create .env.production: file already exists or directory is not writable. Nothing was changed.\n");
    exit(1);
}
fwrite($file, $contents);
fclose($file);
echo "Created .env.production with new secrets. Set your domain, SMTP settings and superadmin email before deployment.\n";
