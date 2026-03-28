<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/config.php';
$apiKey = OMDB_API_KEY;
$title = urlencode($_GET['t']);
$url = "https://www.omdbapi.com/?apikey=$apiKey&t=$title";

// Fetch OMDB  
$response = file_get_contents($url);

if ($response === FALSE) {
    http_response_code(500);
    echo json_encode([
        "Response" => "False",
        "Error" => "Could not reach OMDB API."
    ]);
    exit;
}

echo $response;
exit;
?>
