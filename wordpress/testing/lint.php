<?php
$files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator('/app', FilesystemIterator::SKIP_DOTS));
foreach ($files as $file) {
    if ($file->getExtension() !== 'php') continue;
    token_get_all(file_get_contents($file->getPathname()), TOKEN_PARSE);
    echo 'PHP syntax OK: ' . $file->getPathname() . PHP_EOL;
}
