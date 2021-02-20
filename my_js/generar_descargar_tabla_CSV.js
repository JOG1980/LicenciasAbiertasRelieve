///descargar archivo --------------------------------------------------------------
		  
function descargarArchivo(contenidoEnBlob, nombreArchivo) {
    var reader = new FileReader();
    reader.onload = function (event) {
        var save = document.createElement('a');
        save.href = event.target.result;
        save.target = '_blank';
        save.download = nombreArchivo || 'archivo.dat';
        var clicEvent = new MouseEvent('click', {
            'view': window,
                'bubbles': true,
                'cancelable': true
        });
        save.dispatchEvent(clicEvent);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    };
    reader.readAsDataURL(contenidoEnBlob);


};



//Genera un objeto Blob con los datos en un archivo TXT
function leerTabla(nombre_tabla) {

    var mitexto ="";
     $("#"+nombre_tabla+" tr").each(function() {
          var linea ="";
         $(this).children("th, td").each(function() { //para que recorra tanto th (los encabezados) y td (las celdas)"
         
           var ctext = $( this ).text();
           var res = ctext.replace(/"/g, "\"\""); //cambiamos las comillas por doble comilla. la g es una expresion regular que significa todas lkas ocurrencias
           // var res = $( this ).text();

           linea += "\""+res + "\",";
        });
        linea = linea.slice(0, -1);
        mitexto += linea+"\n";
    });
    var texto = [];
    //texto.push('Datos hola:\n');
    texto.push(mitexto);
    texto.push('\n');
    //El contructor de Blob requiere un Array en el primer parámetro
    //así que no es necesario usar toString. el segundo parámetro
    //es el tipo MIME del archivo
    return new Blob(texto, {
        type: 'text/plain'
    });
};


//ejemplo de llamada  
//descargarArchivo( leerTabla('id_tabla') , 'nombre archivo.csv');
    
