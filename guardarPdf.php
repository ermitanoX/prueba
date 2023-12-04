<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Directorio en tu servidor donde deseas guardar los archivos
    $directorioDestino = '/recibos/';

    // Genera un nombre de archivo único basado en la fecha y hora actual
    $currentDate = date("Y-m-d_H-i-s");
    $filename = 'recibo_' . $currentDate . '.pdf';

    // Lee los datos de la solicitud POST
    $pdfData = file_get_contents('php://input');

    // Guarda el archivo en el directorio especificado
    file_put_contents($directorioDestino . $filename, $pdfData);

    // Devuelve una respuesta, por ejemplo, un JSON indicando éxito
    header('Content-Type: application/json');
    echo json_encode(['success' => true, 'message' => 'Archivo guardado con éxito']);
    exit();
}
