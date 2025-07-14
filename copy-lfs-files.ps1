$lfsFilesOutput = git lfs ls-files
$exportDir = ".\lfs-export"

if (-not (Test-Path $exportDir)) {
    New-Item -ItemType Directory -Path $exportDir
}

foreach ($line in $lfsFilesOutput) {
    $file = $line.Substring($line.IndexOf('*') + 2).Trim()
    if (Test-Path $file) {
        Copy-Item -Path $file -Destination $exportDir
        Write-Host "Copied $file to $exportDir"
    } else {
        Write-Host "Warning: Could not find LFS file '$file' in the working directory."
    }
}
