$client = New-Object System.Net.WebClient
try {
    $data = $client.DownloadString('http://localhost:4000/api/health')
    Write-Output "Health: $data"
} catch {
    Write-Output "Error connecting: $($_.Exception.Message)"
}