param([string]$OutputPath = 'artifacts/iya-wordpress-install.zip')
$ErrorActionPreference = 'Stop'
$workspace = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$staging = Join-Path $workspace ('.test-output/package-' + [Guid]::NewGuid().ToString('N'))
$plugins = Join-Path $staging 'wp-content/mu-plugins'
New-Item -ItemType Directory -Force $plugins | Out-Null
foreach ($file in @('000-iya-store-api-cache.php','010-iya-checkout.php','020-iya-storefront.php')) {
    Copy-Item -LiteralPath (Join-Path $workspace ('wordpress/' + $file)) -Destination $plugins
}
Copy-Item -LiteralPath (Join-Path $workspace 'wordpress/iya-storefront') -Destination $plugins -Recurse
Copy-Item -LiteralPath (Join-Path $workspace 'docs/wordpress.md') -Destination (Join-Path $staging 'LEIA-ANTES-DE-INSTALAR.md')
New-Item -ItemType Directory -Force (Join-Path $staging 'docs') | Out-Null
foreach ($guide in @('validation-commerce.md','validation-finalization.md')) {
    Copy-Item -LiteralPath (Join-Path $workspace ('docs/' + $guide)) -Destination (Join-Path $staging ('docs/' + $guide))
}
New-Item -ItemType Directory -Force (Join-Path $staging 'tools') | Out-Null
Copy-Item -LiteralPath (Join-Path $workspace 'wordpress/tools/audit.php') -Destination (Join-Path $staging 'tools/iya-audit.php')
$target = [IO.Path]::GetFullPath((Join-Path $workspace $OutputPath))
if (-not $target.StartsWith($workspace + [IO.Path]::DirectorySeparatorChar, [StringComparison]::OrdinalIgnoreCase)) { throw 'O pacote deve permanecer dentro do workspace.' }
New-Item -ItemType Directory -Force (Split-Path $target -Parent) | Out-Null
Add-Type -AssemblyName System.IO.Compression.FileSystem
Add-Type -AssemblyName System.IO.Compression
$zipStream = [IO.File]::Open($target, [IO.FileMode]::Create)
$zipArchive = [IO.Compression.ZipArchive]::new($zipStream, [IO.Compression.ZipArchiveMode]::Create)
try {
    foreach ($entry in Get-ChildItem -LiteralPath $staging -File -Recurse) {
        $relative = $entry.FullName.Substring($staging.Length + 1).Replace('\', '/')
        [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArchive, $entry.FullName, $relative) | Out-Null
    }
} finally { $zipArchive.Dispose(); $zipStream.Dispose() }
Write-Output ('Pacote local preparado: ' + $target)
Write-Output 'Nenhum arquivo foi instalado em servidor remoto. Fixtures, credenciais e banco de dados não são incluídos.'

