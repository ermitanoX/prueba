<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Directorio en tu servidor donde deseas guardar los archivos
    $directorioDestino = '/ruta/a/tu/directorio/recibos/';

    // Verifica que el directorio exista o créalo si no existe
    if (!is_dir($directorioDestino)) {
        mkdir($directorioDestino, 0755, true);
    }

    // Genera un nombre de archivo único basado en la fecha y hora actual
    $currentDate = date("Y-m-d_H-i-s");
    $filename = 'recibo_' . $currentDate . '.pdf';

    // Lee los datos de la solicitud POST
    $pdfData = file_get_contents('php://input');

    // Guarda el archivo en el directorio especificado
    $filePath = $directorioDestino . $filename;
    $writeSuccess = file_put_contents($filePath, $pdfData);

    if ($writeSuccess !== false) {
        // Devuelve una respuesta JSON indicando éxito
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Archivo guardado con éxito', 'filePath' => $filePath]);
    } else {
        // Devuelve una respuesta JSON indicando error
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error al guardar el archivo']);
    }

    exit();
}
