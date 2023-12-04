//https://www.youtube.com/watch?v=zAkKkEf0x3Y
// function printPageArea(areaId){
//     var printContent = document.getElementById(areaId).innerHTML;
//     var originalContent = document.body.innerHTML;
//     document.body.innerHTML = printContent;
//     window.print();
//     document.body.innerHTML = originalContent;
// }

// function CreatePDFfromHTML() {
//     var HTML_Width = $(".contenedor_card").width();
//     var HTML_Height = $(".contenedor_card").height();
//     var top_left_margin = 15;
//     var PDF_Width = HTML_Width + (top_left_margin * 2);
//     var PDF_Height = (PDF_Width * 1.5) + (top_left_margin * 2);
//     var canvas_image_width = HTML_Width;
//     var canvas_image_height = HTML_Height;

//     var totalPDFPages = Math.ceil(HTML_Height / PDF_Height) - 1;

//     html2canvas($(".contenedor_card")[0]).then(function (canvas) {
//         var imgData = canvas.toDataURL("image/jpeg", 1.0);
//         var pdf = new jsPDF('p', 'pt', [PDF_Width, PDF_Height]);
//         pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin, canvas_image_width, canvas_image_height);
//         for (var i = 1; i <= totalPDFPages; i++) { 
//             pdf.addPage(PDF_Width, PDF_Height);
//             pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
//         }
//         pdf.save(numeroRegistro+".pdf");
//         $(".html-content").hide();
//     });
// }

function savePDF() {
    var options = {
        scale: 3,
        useCORS: true
    };

    html2canvas(document.getElementById('divImprimir'), options).then(function (canvas) {
        var pdf = new jsPDF();
        var imgWidth = pdf.internal.pageSize.getWidth();
        var imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

        var currentDate = new Date().toLocaleDateString().replace(/\//g, '-');
        var filename = 'recibo_' + currentDate + '.pdf';

        // Convierte el PDF a una cadena de bytes (arraybuffer)
        var pdfData = pdf.output('arraybuffer');

        // Realiza una solicitud POST al servidor para guardar el PDF
        fetch('/guardarPdf.php', {
            method: 'POST',
            body: pdfData
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // Puedes mostrar un mensaje de éxito al usuario o realizar otras acciones necesarias
        })
        .catch(error => {
            console.error('Error al guardar el archivo:', error);
        });
    });
}



function printPDF() {
    // Configura las opciones de html2canvas para una mayor resolución
    var options = {
        scale: 3, // Ajusta según sea necesario para mejorar la calidad
        useCORS: true // Habilita el uso de CORS para imágenes externas
    };

    // Captura el contenido del div con las opciones especificadas
    html2canvas(document.getElementById('divImprimir'), options).then(function (canvas) {
        // Crea una nueva instancia de jsPDF
        var pdf = new jsPDF();

        // Calcula las dimensiones de la imagen en relación con la página
        var imgWidth = pdf.internal.pageSize.getWidth();
        var imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Agrega la imagen al PDF y establece la posición en (0, 0)
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, imgWidth, imgHeight);

        // Aplica estilos específicos para la vista de impresión
        var stylesForPrint = '<style type="text/css">@media print { img { width: 100%; } }</style>';
        var printWindow = window.open('', '_blank');
        var nombreNegocio = "Hola";
        printWindow.document.write('<html><head><title>' + nombreNegocio + '</title>' + stylesForPrint + '</head><body>');
        printWindow.document.write('<img src="' + canvas.toDataURL() + '"/>'); // Muestra la imagen en la vista de impresión
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Espera 2 segundos antes de abrir el menú de impresión
        setTimeout(function () {
            printWindow.print();
            printWindow.close(); // Cierra la ventana después de imprimir
        }, 1000); // 2000 milisegundos = 2 segundos
    });
}

function openWhatsApp() {
    // Llama a la función savePDF para generar y guardar el PDF
    savePDF();

    // Solicita al usuario que ingrese el número de teléfono
    var phoneNumber = prompt("Por favor, ingresa el número de teléfono (sin espacios ni guiones):");

    // Verifica si el usuario ingresó un número y si no canceló el cuadro de diálogo
    if (phoneNumber !== null && phoneNumber !== "") {

        // Crea el mensaje para WhatsApp
        var textMessage = "Hola, aquí está tu recibo.";

        // Crea el enlace de WhatsApp con el número y el mensaje
        var whatsappLink = "whatsapp://send?phone=" + phoneNumber + "&text=" + encodeURIComponent(textMessage);

        // Abre el enlace de WhatsApp
        window.location.href = whatsappLink;
    } else {
        alert("No ingresaste un número de teléfono. La operación ha sido cancelada.");
    }
}



function descargarDesdePrompt() {
    // Pide al usuario que ingrese el enlace mediante un cuadro de diálogo prompt
    var enlace = "https://drive.google.com/file/d/1G-A5DmFWTBOs9CT7Gfb_oAy502BwkQUO/view?usp=sharing";

    if (enlace) {
        // Extrae el ID del archivo desde el enlace proporcionado
        var fileId = enlace.match(/[-\w]{25,}/);

        if (fileId) {
            // Construye el enlace de descarga
            var downloadLink = 'https://drive.google.com/uc?export=download&id=' + fileId[0];

            // Crea un elemento <a> para el enlace de descarga
            var link = document.createElement('a');
            link.href = downloadLink;

            // Agrega el elemento <a> al documento
            document.body.appendChild(link);

            // Simula un clic en el enlace para iniciar la descarga
            link.click();

            // Elimina el elemento <a> después de iniciar la descarga
            document.body.removeChild(link);

            // Almacena el Blob de la imagen descargada
            fetch(downloadLink)
                .then(response => response.blob())
                .then(blob => {
                    imagenDescargadaBlob = blob;
                })
                .catch(error => console.error('Error al cargar la imagen:', error));

            // Muestra el input de tipo file para que el usuario elija la imagen descargada
            document.getElementById('inputImagen').style.display = 'block';
        } else {
            alert('El enlace proporcionado no es válido. Asegúrate de que sea un enlace compartido de Google Drive.');
        }
    } else {
        alert('No se proporcionó ningún enlace. La descarga ha sido cancelada.');
    }
}

function cargarImagen() {
    // Obtener el elemento de input de tipo file
    var inputImagen = document.getElementById('inputImagen');

    // Verificar si se seleccionó un archivo
    if (inputImagen.files && inputImagen.files[0]) {
        var reader = new FileReader();

        // Configurar la función de carga
        reader.onload = function (e) {
            // Obtener el elemento de imagen
            var imagenDescargada = document.getElementById('imagenDescargada');

            // Establecer la URL base64 como src de la imagen
            imagenDescargada.src = e.target.result;
        };

        // Leer el contenido del archivo como una URL base64
        reader.readAsDataURL(inputImagen.files[0]);
    } else {
        alert('Por favor, selecciona una imagen antes de hacer clic en "Cargar Imagen".');
    }
}

// Obtén el elemento dialog
var dialogoArchivo = document.getElementById('dialogoArchivo');
        
function abrirDialogo() {
    // Abre el diálogo
    dialogoArchivo.showModal();

    // Maneja el evento de cambio (cuando el usuario selecciona un archivo)
    var inputArchivo = document.getElementById('inputArchivo');
    inputArchivo.addEventListener('change', function() {
        // Accede al archivo seleccionado (si existe)
        var archivo = inputArchivo.files[0];

        if (archivo) {
            // Aquí puedes realizar acciones con el archivo, si es necesario
            console.log('Archivo seleccionado:', archivo);

            // También puedes cerrar el diálogo si es necesario
            // dialogoArchivo.close();
        }
    });
}

function cerrarDialogo() {
    // Cierra el diálogo
    dialogoArchivo.close();
}
