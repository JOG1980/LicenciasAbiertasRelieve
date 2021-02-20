$( function() {

	//datepicker ---------------------------------------------------------
	$( ".datepicker_fecha_ini , .datepicker_fecha_fin ").datepicker({
		  showOn: "button",
		  buttonImage: "images/calendar2.png",
		  buttonImageOnly: true,
		  buttonText: "date",
		  //changeMonth: true,
	      //changeYear: true,
	      //yearRange: "2021:c+10"
	})
	.datepicker( "option", "dateFormat", "yy-mm-dd" );


	 $.datepicker.regional['es'] = {
		 closeText: 'Cerrar',
		 prevText: '< Ant',
		 nextText: 'Sig >',
		 currentText: 'Hoy',
		 monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
		 monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
		 dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
		 dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
		 dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
		 weekHeader: 'Sm',
		 dateFormat: 'dd/mm/yy',
		 firstDay: 1,
		 isRTL: false,
		 showMonthAfterYear: false,
		 yearSuffix: ''
	};
	$.datepicker.setDefaults($.datepicker.regional['es']);
			
	//tabs ---------------------------------------------------------------
	$( "#tabs" ).tabs();




	//== FUNCIONES DE INICIALIZACION ============================================================================================

	var initZT = function(zot){
		if(zot=="ZOTGM"){
		  	 var zt ="<option value='TCENGUE' selected>ZT GUERRERO</option>";
		  	 zt += "<option value='TCENSUR'>ZT SUR</option>";
		  	 $( "#zona_transmision" ).html(zt);
		  }else if(zot=="ZOTPTX"){
		  	  var zt ="<option value='TCENPUB' selected>ZT PUEBLA</option>";
		  	 $( "#zona_transmision" ).html(zt);
		  }
		  else if(zot=="ZOTTLC"){
		  	  var zt ="<option value='' selected></option>";
		  	  $( "#zona_transmision" ).html(zt);
		  }
	}
  
		  
	//EVENTOS DE COMPONENTES (LISTENERS) ------------------------------------------------	  
		  
	//change de l select de la zona de operacion ------------------
	$( "#zona_operacion" ).change(function() {
		  var czot = $(this).val();
		  //alert("<> "+value);
			initZT(czot);		  
	});

	

	//click del boton de buscar ------------------------------------
    $( "#btn_buscar_solicitudes" ).click(function() {
	  	//alert( "BUSCAR SOLICITUD" );
		var zona_operacion 	= $("#zona_operacion").val();
		var zona_transmision 	= $("#zona_transmision").val();
		var busqueda_fecha_ini = $("#busqueda_fecha_ini").val();
		var busqueda_fecha_fin = $("#busqueda_fecha_fin").val();
		
		if(busqueda_fecha_ini!="" && busqueda_fecha_fin!=""){
			 buscarSolicitudes(zona_operacion, zona_transmision, busqueda_fecha_ini, busqueda_fecha_fin);
		}
		else 
			alert("Introduce un rango de fecha valido");	
		 
	});
  
  
  	$( ".datepicker_fecha_ini , .datepicker_fecha_fin" ).change(function() {
		  calcularTextoFecha();		  
	});


  	$( "#btn_restablecer_campos" ).click(function() {
		//alert("rest");
		 $( ".datepicker_fecha_ini" ).datepicker( "setDate", $("#fecha_busqueda_ini_default").val() );
		$( ".datepicker_fecha_fin" ).datepicker( "setDate", $("#fecha_busqueda_fin_default").val() );
  	});

				
	
		
	//== FUNCIONES AJAX ========================================================================================================

	//--Busqueda de solicitudes --------------------------------------------------------
	var buscarSolicitudes = function(zona_operacion, 
									zona_transmision, 
									busqueda_fecha_ini, 
									busqueda_fecha_fin){

		$("#wait").css("display", "block");

		var obj = new Object();
		obj.zona_operacion 	 = zona_operacion;
		obj.zona_transmision = zona_transmision;
		obj.busqueda_fecha_ini = busqueda_fecha_ini;
		obj.busqueda_fecha_fin = busqueda_fecha_fin;
		
		// alert(
		//   "zona_operacion: "+obj.zona_operacion+"\n"
		// 	+"zona_transmision: "+obj.zona_transmision+"\n"
		// 	+"busqueda_fecha_ini: "+obj.busqueda_fecha_ini+"\n"
		// 	+"busqueda_fecha_fin: "+obj.busqueda_fecha_fin+"\n"
		// 	);

		var obj_json = JSON.stringify(obj);
		
		$.ajax({
			type: "POST",
			url: 'getDBSolicitudes.php',
			async: true,		// llamada de tipo asincrona
			cache: false,
			//data: $(this).serialize(),
			dataType : 'text',        // el tipo de información que se espera de respuesta
			data: {'datos': obj_json},
			success: function(data, status, xhr) //(response)
			{
				var obj = JSON.parse(data);
	
				// alert(
				// 	"zona_operacion: "+obj.zona_operacion+"\n"
				// 	+"zona_transmision: "+obj.zona_transmision+"\n"
				// 	+"sid: "+obj.db_sid+"\n"
				// 	+"usuario: "+obj.db_usuario+"\n"
				// 	+"password: "+obj.db_password+"\n"
				// 	+"busqueda_fecha_ini: "+obj.busqueda_fecha_ini+"\n"
				// 	+"busqueda_fecha_fin: "+obj.busqueda_fecha_fin+"\n"
				// 	);
				//asignamos el horario de la busqueda
				$("#date_time_busqueda").text(obj.date_time_busqueda);
				//alert("stid1: >>> "+obj.stid1+"\nreg;\n>>>"+obj.records1);
				//registros anteriores -------------------------------------------------------------------------------------
				var contenido_tabla = "";
				if(obj.records1!=null){
					var records = obj.records1;
					for(var i=0; i<records.length ; i++){
						contenido_tabla+="<tr LICENSE_ID='"+records[i].LICENSE_ID+"'>";
						contenido_tabla+="<td>"+(i+1)+"</td>";
						contenido_tabla+="<td>"+records[i].ESTADO+"</td>";
						contenido_tabla+="<td>"+records[i].LICENSE_NUM+"</td>";
						contenido_tabla+="<td>"+records[i].GRANTING_DATE+"</td>";	
						contenido_tabla+="<td>"+records[i].PLANNED_EDATE+"</td>";	
						contenido_tabla+="<td>"+(records[i].ESTADO=='VIGENTE'?records[i].DIAS_VIGENTE:records[i].DIAS_VENCIMIENTO)+"</td>";				
						contenido_tabla+="<td>"+records[i].SUBSTATION_NAME+"</td>";				
						contenido_tabla+="<td>"+records[i].EQP_TYPE+" "+records[i].EQP_SHORT_NAME+"</td>";
						contenido_tabla+="<td>"+records[i].ESPECIALIDAD+"</td>";
						contenido_tabla+="<td>"+records[i].WORK_OBJECTIVES+"</td>";
						contenido_tabla+="<td></td>";
						contenido_tabla+="<td></td>";
						contenido_tabla+="<td>"+records[i].APP_NUM+"</td>";
						contenido_tabla+="<td>"+(records[i].DEAD_OR_ALIVE==1?'V':'M')+"</td>";
						contenido_tabla+="<td>"+records[i].RESPONSIBLE_FOR_WORK_EMP_ID+"</td>";
						contenido_tabla+="<td>"+(records[i].LICENSE_TYPE_ID==2?'EMERGENCIA':'PROGRAMADA')+"</td>";

						contenido_tabla+="<td><div class='contador_reprog my_link' id='"+records[i].LICENSE_ID+"' onclick='mostrarProrrogas(\""+records[i].LICENSE_ID+"\",\""+records[i].LICENSE_NUM+"\");'>P</div></td>";
						
						contenido_tabla+="</tr>"; 

					}//end for
				}
				$("#tabla_licencias_anteriores tbody").html(contenido_tabla);
				

				//registros en el 2021 antes del rango------------------------------------------------------------------------------------
				var contenido_tabla = "";
				if(obj.records2!=null){
					var records = obj.records2;
					for(var i=0; i<records.length ; i++){
						contenido_tabla+="<tr LICENSE_ID='"+records[i].LICENSE_ID+"'>";
						contenido_tabla+="<td>"+(i+1)+"</td>";
						contenido_tabla+="<td>"+records[i].ESTADO+"</td>";
						contenido_tabla+="<td>"+records[i].LICENSE_NUM+"</td>";
						contenido_tabla+="<td>"+records[i].GRANTING_DATE+"</td>";	
						contenido_tabla+="<td>"+records[i].PLANNED_EDATE+"</td>";	
						contenido_tabla+="<td>"+(records[i].ESTADO=='VIGENTE'?records[i].DIAS_VIGENTE:records[i].DIAS_VENCIMIENTO)+"</td>";				
						contenido_tabla+="<td>"+records[i].SUBSTATION_NAME+"</td>";				
						contenido_tabla+="<td>"+records[i].EQP_TYPE+" "+records[i].EQP_SHORT_NAME+"</td>";
						contenido_tabla+="<td>"+records[i].ESPECIALIDAD+"</td>";
						contenido_tabla+="<td>"+records[i].WORK_OBJECTIVES+"</td>";
						contenido_tabla+="<td></td>";
						contenido_tabla+="<td></td>";
						contenido_tabla+="<td>"+records[i].APP_NUM+"</td>";
						contenido_tabla+="<td>"+(records[i].DEAD_OR_ALIVE==1?'V':'M')+"</td>";
						contenido_tabla+="<td>"+records[i].RESPONSIBLE_FOR_WORK_EMP_ID+"</td>";
						contenido_tabla+="<td>"+(records[i].LICENSE_TYPE_ID==2?'EMERGENCIA':'PROGRAMADA')+"</td>";

						contenido_tabla+="<td><div class='contador_reprog my_link' id='"+records[i].LICENSE_ID+"' onclick='mostrarProrrogas(\""+records[i].LICENSE_ID+"\",\""+records[i].LICENSE_NUM+"\");'></div></td>";

						contenido_tabla+="</tr>";
				 
					}//end for
				}
				$("#tabla_licencias_este_anio_antes_de_rango tbody").html(contenido_tabla);
				


				//registros en el 2021 dentro del rango -------------------------------------------------------------------------------------
				var contenido_tabla = "";
				if(obj.records3!=null){
					var records = obj.records3;
					
					for(var i=0; i<records.length ; i++){
						contenido_tabla+="<tr LICENSE_ID='"+records[i].LICENSE_ID+"'>";
						contenido_tabla+="<td>"+(i+1)+"</td>";
						contenido_tabla+="<td>"+records[i].ESTADO+"</td>";
						contenido_tabla+="<td>"+records[i].LICENSE_NUM+"</td>";
						contenido_tabla+="<td>"+records[i].GRANTING_DATE+"</td>";

						//contenido_tabla+="<td>"+records[i].PLANNED_EDATE+"</td>";	
						//Si esta TERMINADA pintamos el LIC_REMOVAL_DATE, si no esta terminada pintamos el dia que esta planeado termine la solicitud PLANNED_EDATE
						contenido_tabla+="<td>"+(records[i].ESTADO=='TERMINADA'?records[i].LIC_REMOVAL_DATE:records[i].PLANNED_EDATE)+"</td>";  				
						
						//evaluar vigente (dias faltantes) y vencida (dias ya vencida)
						if(records[i].ESTADO=='VIGENTE')
							contenido_tabla+="<td>"+records[i].DIAS_VIGENTE+"</td>";
						else if(records[i].ESTADO=='VENCIDA')
							contenido_tabla+="<td>"+records[i].DIAS_VENCIMIENTO+"</td>";
						else
							contenido_tabla+="<td></td>";				
						
						contenido_tabla+="<td>"+records[i].SUBSTATION_NAME+"</td>";				
						contenido_tabla+="<td>"+records[i].EQP_TYPE+" "+records[i].EQP_SHORT_NAME+"</td>";
						contenido_tabla+="<td>"+records[i].ESPECIALIDAD+"</td>";
						contenido_tabla+="<td>"+records[i].WORK_OBJECTIVES+"</td>";
						contenido_tabla+="<td></td>";
						contenido_tabla+="<td></td>";
						contenido_tabla+="<td>"+records[i].APP_NUM+"</td>";
						contenido_tabla+="<td>"+(records[i].DEAD_OR_ALIVE==1?'V':'M')+"</td>";
						contenido_tabla+="<td>"+records[i].RESPONSIBLE_FOR_WORK_EMP_ID+"</td>";
						contenido_tabla+="<td>"+(records[i].LICENSE_TYPE_ID==2?'EMERGENCIA':'PROGRAMADA')+"</td>";

						contenido_tabla+="<td><div class='contador_reprog my_link' id='"+records[i].LICENSE_ID+"' onclick='mostrarProrrogas(\""+records[i].LICENSE_ID+"\",\""+records[i].LICENSE_NUM+"\");'></div></td>";

						contenido_tabla+="</tr>";
					}
				}
				$("#tabla_licencias_este_anio_en_rango tbody").html(contenido_tabla);
				


				//obtenemos prorrogas -----------------------------------------------------------------
				var contenido_tabla_prorrogas="";
				contenido_tabla_prorrogas += obtenerProrrogas(obj.records1_prorrogas);
				contenido_tabla_prorrogas += obtenerProrrogas(obj.records2_prorrogas);
				contenido_tabla_prorrogas += obtenerProrrogas(obj.records3_prorrogas);
				$("#tabla_prorrogas tbody").html(contenido_tabla_prorrogas);

				//carculamos reprogramaciones--------------------------
				calcularProrrogas('tabla_licencias_anteriores');
				calcularProrrogas('tabla_licencias_este_anio_antes_de_rango');
				calcularProrrogas('tabla_licencias_este_anio_en_rango');


				//pintar referencia de texto (titulo)
				pintarTextoReferencia(obj.zona_operacion, obj.zona_transmision, obj.busqueda_fecha_ini, obj.busqueda_fecha_fin);

				//pintar colores
				pintarColores();

				calculosEstaisticos();
				
				//alert('BUSQUEDA COMPLETA');


		    },
			error: function (jqXhr, textStatus, errorMessage) {
					//$("#my_id1").append('Error' + errorMessage);
					alert('Error: ' + errorMessage);

			},
			// código a ejecutar sin importar si la petición falló o no
			complete : function(xhr, status) {
				 //alert('COMPLETA');
				 //ocultamos la animacion de carga
				 $("#wait").css("display", "none");
	
			}
	   });//end ajax
	}//end buscarSolicitudes
						

    //BOTONES DEL CVS ----------------------------------------------------------------------------
    $( "#btn_generar_csv_licencias_anteriores" ).click(function() {
    	 var dt = $("#date_time_busqueda").text();
	  	var ndt = dt.replace(/:/g, "_"); //cambiamos los : por _ la g es una expresion regular que significa todas lkas ocurrencias
		var ndt = ndt.replace(" ", "_t"); //cambiamos los : por _ la g es una expresion regular que significa todas lkas ocurrencias
		descargarArchivo( leerTabla('tabla_licencias_anteriores') , 'Licencias antes del 2021 ('+ndt+').csv');
    });
    
    $( "#btn_generar_csv_licencias_anio_actual_antes_rango_fechas" ).click(function() {
       var dt = $("#date_time_busqueda").text();
	  	var ndt = dt.replace(/:/g, "_"); //cambiamos los : por _ la g es una expresion regular que significa todas lkas ocurrencias
		var ndt = ndt.replace(" ", "_t"); //cambiamos los : por _ la g es una expresion regular que significa todas lkas ocurrencias
		descargarArchivo( leerTabla('tabla_licencias_este_anio_antes_de_rango') , 'Licencias del 2021 antes de rango ('+ndt+').csv');

    });

    
    $( "#btn_generar_csv_licencias_anio_actual_en_rango_fechas" ).click(function() {
       var dt = $("#date_time_busqueda").text();
	  	var ndt = dt.replace(/:/g, "_"); //cambiamos los : por _ la g es una expresion regular que significa todas lkas ocurrencias
		var ndt = ndt.replace(" ", "_t"); //cambiamos los : por _ la g es una expresion regular que significa todas lkas ocurrencias
		descargarArchivo( leerTabla('tabla_licencias_este_anio_en_rango') , 'Licencias del 2021 en rango ('+ndt+').csv');
    });
	
	

	
	//==PRORROGAS ===========================================================================================	
	var obtenerProrrogas = function(prorrogas){
		//prorrogas
		var contenido_tabla_prorrogas="";
		if(prorrogas!=null){
			for(var i=0; i<prorrogas.length ; i++){
				contenido_tabla_prorrogas+="<tr proroga_lic='"+prorrogas[i].LICENSE_ID+"' >";
				contenido_tabla_prorrogas+="<td></td>";
				contenido_tabla_prorrogas+="<td>"+prorrogas[i].PROLONG_DATE+"</td>";
				contenido_tabla_prorrogas+="<td>"+prorrogas[i].FROM_EDATE+"</td>";
				contenido_tabla_prorrogas+="<td>"+prorrogas[i].TO_EDATE+"</td>";
				contenido_tabla_prorrogas+="<td>"+prorrogas[i].PROLONG_CAUSE+"</td>";
				contenido_tabla_prorrogas+="</tr>";
			}
		}//end if
		return contenido_tabla_prorrogas;
	}


	var calcularProrrogas = function(c_tabla_licencias){
		
		var c_lic_1="";
		$( "#"+c_tabla_licencias+" tbody tr" ).each(function( index ) {
				
			c_lic_1 = $(this).attr("LICENSE_ID");

			var contador =0;
			$( "#tabla_prorrogas tbody tr" ).each(function( index ) {
		
				 var c_lic = $(this).attr("proroga_lic");
				 if(c_lic==c_lic_1){
				 	contador++;
				 }			  
			});
			
			if(contador>0)
				$(this).find(".contador_reprog").text(contador);
		});

	}



	//==OTROS CODIGOS ===========================================================================================
	/*
	var crearListaAnios = function(){
		var cyear = new Date().getFullYear();
		
		for(var i=cyear ; i>= 2010 ; i--){
			var contenido = $("#lista_limite_anio_pasado").html();
			contenido += "<option>"+i+"</option>";
			$("#lista_limite_anio_pasado").html(contenido);
		}
	}
	*/


	var pintarColores = function(){
		//alert(">>>> ");
		$(".tabla_res tbody tr").each(function( index ) {
		  //console.log( index + ": " + $( this ).text() );
		  	var estado =  $(this).find("td:nth-child(2)").text();
		  
		  	if(estado=="VIGENTE")
		  		$(this).find("td").css("color","#27AE60");
		  	else if(estado=="VENCIDA")
		  		$(this).find("td").css("color","red");
		});
	}



	var pintarTextoReferencia = function(zona_operacion ,zona_transmision,busqueda_fecha_ini,busqueda_fecha_fin){
		if(zona_transmision=="TCENGUE") zona_transmision="ZT GUERRERO";
		else if(zona_transmision=="TCENSUR") zona_transmision="ZT SUR";
		else if(zona_transmision=="TCENPUB") zona_transmision="ZT PUEBLA";
		else zona_transmision="";

		var titulo_busqueda = zona_operacion+" -> " + zona_transmision+" -> Intervalo de Búsqueda: " + busqueda_fecha_ini + " - " + busqueda_fecha_fin;
		$("#titulo_busqueda").text(titulo_busqueda);
	}



    //CALCULOS ESTADISTICOS ===========================================================================================================

    var calculosEstaisticos = function(){

    	//fechas en las estadisticas

    	//------------------------------------------------------------------------------------------------------------------------------------------------------
		//CALCULO DE LICENCIAS VIGENTES Y VENCIDAS AÑOS ANTERIORE
		var subestaciones_licencias_anteriores_vigentes =0;
		var subestaciones_licencias_anteriores_vencidas =0;
		var lineas_licencias_anteriores_vigentes =0;
		var lineas_licencias_anteriores_vencidas =0;
		var protecciones_licencias_anteriores_vigentes =0;
		var protecciones_licencias_anteriores_vencidas =0;
		var comunicaciones_licencias_anteriores_vigentes =0;
		var comunicaciones_licencias_anteriores_vencidas =0;
		var control_licencias_anteriores_vigentes =0;
		var control_licencias_anteriores_vencidas =0;

		var contador_anteriores_este_anio =0; //contador de numero de licencias

		$( "#tabla_licencias_anteriores tbody tr" ).each(function( index ) {
		  	var estado =  $(this).find("td:nth-child(2)").text();
		  	var especialidad =  $(this).find("td:nth-child(9)").text();


		  	//conteo de licencias vigentes ----------------------------------------
			if(estado =='VIGENTE'){
				if(especialidad =='SUBESTACIONES') 	   subestaciones_licencias_anteriores_vigentes++;
				else if(especialidad =='LINEAS')         lineas_licencias_anteriores_vigentes++;
				else if(especialidad =='PROTECCIONES')   protecciones_licencias_anteriores_vigentes++;
				else if(especialidad =='COMUNICACIONES') comunicaciones_licencias_anteriores_vigentes++;
				else if(especialidad =='CONTROL') 	   control_licencias_anteriores_vigentes++;	
			} 
			//conteo de licencias vencidas ----------------------------------------
			else if(estado =="VENCIDA"){
				
				if(especialidad =='SUBESTACIONES') 	   subestaciones_licencias_anteriores_vencidas++;
				else if(especialidad =='LINEAS')         lineas_licencias_anteriores_vencidas++;
				else if(especialidad =='PROTECCIONES')   protecciones_licencias_anteriores_vencidas++;
				else if(especialidad =='COMUNICACIONES') comunicaciones_licencias_anteriores_vencidas++;
				else if(especialidad =='CONTROL') 	   control_licencias_anteriores_vencidas++;	
			} 

			contador_anteriores_este_anio++;
		});
		
		//Cargar conteos anios anteriores------------------------------------------------------
		$("#subestaciones1").text(subestaciones_licencias_anteriores_vencidas);
		$("#subestaciones2").text(subestaciones_licencias_anteriores_vigentes);
		$("#lineas1").text(lineas_licencias_anteriores_vencidas);
		$("#lineas2").text(lineas_licencias_anteriores_vigentes);
		$("#protecciones1").text(protecciones_licencias_anteriores_vencidas);
		$("#protecciones2").text(protecciones_licencias_anteriores_vigentes);
		$("#comunicaciones1").text(comunicaciones_licencias_anteriores_vencidas);
		$("#comunicaciones2").text(comunicaciones_licencias_anteriores_vigentes);
		$("#control1").text(control_licencias_anteriores_vencidas);
		$("#control2").text(control_licencias_anteriores_vigentes);

		$("#span_contador_anteriores_este_anio").text(contador_anteriores_este_anio); //pintamos el numero de licencias en el tab


		//-------------------------------------------------------------------------------------------------------------------------------------------------------
		//CALCULO DE LICENCIAS VIGENTES Y VENCIDAS ANTES DEL INTERVALO DE FECHAS 
		var subestaciones_licencias_este_anio_antes_rango_vigentes =0;
		var subestaciones_licencias_este_anio_antes_rango_vencidas =0;
		var lineas_licencias_este_anio_antes_rango_vigentes =0;
		var lineas_licencias_este_anio_antes_rango_vencidas =0;
		var protecciones_licencias_este_anio_antes_rango_vigentes =0;
		var protecciones_licencias_este_anio_antes_rango_vencidas =0;
		var comunicaciones_licencias_este_anio_antes_rango_vigentes =0;
		var comunicaciones_licencias_este_anio_antes_rango_vencidas =0;
		var control_licencias_este_anio_antes_rango_vigentes =0;
		var control_licencias_este_anio_antes_rango_vencidas =0;

		var contador_este_anio_antes_rango = 0; //contador de numero de licencias
	
		$( "#tabla_licencias_este_anio_antes_de_rango tbody tr" ).each(function( index ) {
		  	var estado =  $(this).find("td:nth-child(2)").text();
		  	var especialidad =  $(this).find("td:nth-child(9)").text();

		  	//conteo de licencias vigentes ----------------------------------------
			if(estado =='VIGENTE'){
				if(especialidad =='SUBESTACIONES') 	   subestaciones_licencias_este_anio_antes_rango_vigentes++;
				else if(especialidad =='LINEAS')         lineas_licencias_este_anio_antes_rango_vigentes++;
				else if(especialidad =='PROTECCIONES')   protecciones_licencias_este_anio_antes_rango_vigentes++;
				else if(especialidad =='COMUNICACIONES') comunicaciones_licencias_este_anio_antes_rango_vigentes++;
				else if(especialidad =='CONTROL') 	   control_licencias_este_anio_antes_rango_vigentes++;	
			} 
			//conteo de licencias vencidas ----------------------------------------
			else if(estado =="VENCIDA"){
				
				if(especialidad =='SUBESTACIONES') 	   subestaciones_licencias_este_anio_antes_rango_vencidas++;
				else if(especialidad =='LINEAS')         lineas_licencias_este_anio_antes_rango_vencidas++;
				else if(especialidad =='PROTECCIONES')   protecciones_licencias_este_anio_antes_rango_vencidas++;
				else if(especialidad =='COMUNICACIONES') comunicaciones_licencias_este_anio_antes_rango_vencidas++;
				else if(especialidad =='CONTROL') 	   control_licencias_este_anio_antes_rango_vencidas++;	
			} 

			contador_este_anio_antes_rango++;
	
		});
		
		
		$("#span_contador_este_anio_antes_rango").text(contador_este_anio_antes_rango);
		
		

		//--------------------------------------------------------------------------------------------------------------------
		//CALCULO DE LICENCIAS VIGENTES Y VENCIDAS EN EL INTERVALO DE FECHAS 
		var subestaciones_licencias_este_anio_en_rango_vigentes =0;
		var subestaciones_licencias_este_anio_en_rango_vencidas =0;
		var lineas_licencias_este_anio_en_rango_vigentes =0;
		var lineas_licencias_este_anio_en_rango_vencidas =0;
		var protecciones_licencias_este_anio_en_rango_vigentes =0;
		var protecciones_licencias_este_anio_en_rango_vencidas =0;
		var comunicaciones_licencias_este_anio_en_rango_vigentes =0;
		var comunicaciones_licencias_este_anio_en_rango_vencidas =0;
		var control_licencias_este_anio_en_rango_vigentes =0;
		var control_licencias_este_anio_en_rango_vencidas =0;

		//las icencias otorgadas en el periodo son todas las que salen en la busqueda del rango
		var cont_otorgadas_subestaciones  = 0;
		var cont_otorgadas_lineas         = 0;
		var cont_otorgadas_protecciones   = 0;
		var cont_otorgadas_comunicaciones = 0;
		var cont_otorgadas_control 		  = 0;

		var cont_atendidas_subestaciones  = 0;
		var cont_atendidas_lineas         = 0;
		var cont_atendidas_protecciones   = 0;
		var cont_atendidas_comunicaciones = 0;
		var cont_atendidas_control 		  = 0;

		var contador_este_anio_en_rango =0; //contador de numero de licencias

		$( "#tabla_licencias_este_anio_en_rango tbody tr" ).each(function( index ) {
		  	var estado =  $(this).find("td:nth-child(2)").text();
		  	var especialidad =  $(this).find("td:nth-child(9)").text();

		  	//conteo de licencias vigentes ----------------------------------------
			if(estado =='VIGENTE'){
				if(especialidad =='SUBESTACIONES') 	   subestaciones_licencias_este_anio_en_rango_vigentes++;
				else if(especialidad =='LINEAS')         lineas_licencias_este_anio_en_rango_vigentes++;
				else if(especialidad =='PROTECCIONES')   protecciones_licencias_este_anio_en_rango_vigentes++;
				else if(especialidad =='COMUNICACIONES') comunicaciones_licencias_este_anio_en_rango_vigentes++;
				else if(especialidad =='CONTROL') 	   control_licencias_este_anio_en_rango_vigentes++;	
			} 
			//conteo de licencias vencidas ----------------------------------------
			else if(estado =="VENCIDA"){
				
				if(especialidad =='SUBESTACIONES') 	   subestaciones_licencias_este_anio_en_rango_vencidas++;
				else if(especialidad =='LINEAS')         lineas_licencias_este_anio_en_rango_vencidas++;
				else if(especialidad =='PROTECCIONES')   protecciones_licencias_este_anio_en_rango_vencidas++;
				else if(especialidad =='COMUNICACIONES') comunicaciones_licencias_este_anio_en_rango_vencidas++;
				else if(especialidad =='CONTROL') 	   control_licencias_este_anio_en_rango_vencidas++;	
			} 



		  	if(especialidad=="SUBESTACIONES"){ 
		  		cont_otorgadas_subestaciones++;
		  		if(estado=="TERMINADA") cont_atendidas_subestaciones++;
		  	}
		  	else if(especialidad=="LINEAS"){ 
		  		cont_otorgadas_lineas++;
		  		if(estado=="TERMINADA") cont_atendidas_lineas++;
		  	}
		  	else if(especialidad=="PROTECCIONES"){ 
		  		cont_otorgadas_protecciones++;
		  		if(estado=="TERMINADA") cont_atendidas_protecciones++;
		  	}
		  	else if(especialidad=="COMUNICACIONES"){ 
		  		cont_otorgadas_comunicaciones++;
		  		if(estado=="TERMINADA") cont_atendidas_comunicaciones++;
		  	}
		  	else if(especialidad=="CONTROL"){ 
		  		cont_otorgadas_control++;
		  		if(estado=="TERMINADA") cont_atendidas_control++;
		  	}

		  	contador_este_anio_en_rango++;
		});


		//Cargar conteos anios anteriores------------------------------------------------------
		$("#subestaciones7").text(subestaciones_licencias_este_anio_en_rango_vencidas);
		$("#subestaciones8").text(subestaciones_licencias_este_anio_en_rango_vigentes);
		$("#lineas7").text(lineas_licencias_este_anio_en_rango_vencidas);
		$("#lineas8").text(lineas_licencias_este_anio_en_rango_vigentes);
		$("#protecciones7").text(protecciones_licencias_este_anio_en_rango_vencidas);
		$("#protecciones8").text(protecciones_licencias_este_anio_en_rango_vigentes);
		$("#comunicaciones7").text(comunicaciones_licencias_este_anio_en_rango_vencidas);
		$("#comunicaciones8").text(comunicaciones_licencias_este_anio_en_rango_vigentes);
		$("#control7").text(control_licencias_este_anio_en_rango_vencidas);
		$("#control8").text(control_licencias_este_anio_en_rango_vigentes);

		//Cargar conteos ------------------------------------------------------
		$("#subestaciones5").text(cont_otorgadas_subestaciones);
		$("#subestaciones6").text(cont_atendidas_subestaciones);
		$("#lineas5").text(cont_otorgadas_lineas);
		$("#lineas6").text(cont_atendidas_lineas);
		$("#protecciones5").text(cont_otorgadas_protecciones);
		$("#protecciones6").text(cont_atendidas_protecciones);
		$("#comunicaciones5").text(cont_otorgadas_comunicaciones);
		$("#comunicaciones6").text(cont_atendidas_comunicaciones);
		$("#control5").text(cont_otorgadas_control);
		$("#control6").text(cont_atendidas_control);

		$("#span_contador_este_anio_en_rango").text(contador_este_anio_en_rango);


		//-------------------------------------------------------------------------------------------------------------------------------
		//ABIERTAS ACUMULADAS EN ESTE AÑO  
		var subestaciones_este_anio = subestaciones_licencias_este_anio_antes_rango_vencidas 
									+ subestaciones_licencias_este_anio_antes_rango_vigentes
									+ subestaciones_licencias_este_anio_en_rango_vencidas 
									+ subestaciones_licencias_este_anio_en_rango_vigentes;
		$("#subestaciones9").text(subestaciones_este_anio);

		
		var lineas_este_anio = lineas_licencias_este_anio_antes_rango_vencidas 
							 + lineas_licencias_este_anio_antes_rango_vigentes
							 + lineas_licencias_este_anio_en_rango_vencidas
							 + lineas_licencias_este_anio_en_rango_vigentes;
		$("#lineas9").text(lineas_este_anio);
		
		
		var protecciones_este_anio = protecciones_licencias_este_anio_antes_rango_vencidas
								   + protecciones_licencias_este_anio_antes_rango_vigentes
								   + protecciones_licencias_este_anio_en_rango_vencidas
								   + protecciones_licencias_este_anio_en_rango_vigentes;
		$("#protecciones9").text(protecciones_este_anio);

		
		var comunicaciones_este_anio = comunicaciones_licencias_este_anio_antes_rango_vencidas
									+ comunicaciones_licencias_este_anio_antes_rango_vigentes
									+ comunicaciones_licencias_este_anio_en_rango_vencidas 
									+ comunicaciones_licencias_este_anio_en_rango_vigentes;

		$("#comunicaciones9").text(comunicaciones_este_anio);

		
		var control_este_anio = control_licencias_este_anio_antes_rango_vencidas
							  + control_licencias_este_anio_antes_rango_vigentes
							  + control_licencias_este_anio_en_rango_vencidas
							  + control_licencias_este_anio_en_rango_vigentes;						  
		$("#control9").text(control_este_anio);



		//-------------------------------------------------------------------------------------------------------------------------------
		//SUMA TOTAL ABIERTAS ACUMULADAS (TODAS)  
		var subestaciones_total = subestaciones_este_anio 
									+ subestaciones_licencias_anteriores_vencidas
									+ subestaciones_licencias_anteriores_vigentes;
		$("#subestaciones10").text(subestaciones_total);

		
		var lineas_total = lineas_este_anio 
							+ lineas_licencias_anteriores_vencidas
							+ lineas_licencias_anteriores_vigentes;
		$("#lineas10").text(lineas_total);
		
		
		var protecciones_total = protecciones_este_anio
								   + protecciones_licencias_anteriores_vencidas
								   + protecciones_licencias_anteriores_vigentes;
		$("#protecciones10").text(protecciones_total);

		
		var comunicaciones_total = comunicaciones_este_anio
								+ comunicaciones_licencias_anteriores_vencidas
								+ comunicaciones_licencias_anteriores_vigentes;
		$("#comunicaciones10").text(comunicaciones_total);

		
		var control_total = control_este_anio
							+ control_licencias_anteriores_vencidas
							+ control_licencias_anteriores_vigentes;					  
		$("#control10").text(control_total);

    }//fin estadistica



    var convertirMes = function(cmes){
    	var s_mes="";
    	var n_mes = parseInt(cmes);
    	if(n_mes==1) s_mes ="Enero";
    	else if(n_mes==2) s_mes ="Febrero";
    	else if(n_mes==3) s_mes ="Marzo";
    	else if(n_mes==4) s_mes ="Abril";
    	else if(n_mes==5) s_mes ="Mayo";
    	else if(n_mes==6) s_mes ="Junio";
    	else if(n_mes==7) s_mes ="Julio";
    	else if(n_mes==8) s_mes ="Agosto";
    	else if(n_mes==9) s_mes ="Septiembre";
    	else if(n_mes==10) s_mes ="Octubre";
    	else if(n_mes==11) s_mes ="Noviembre";
    	else if(n_mes==12) s_mes ="Diciembre";    	  
    	return s_mes;
    }




    var calcularTextoFecha = function(){

    	  //inicializamos valor de los date picker de busqueda
   		var fecha_ini = $( ".datepicker_fecha_ini" ).val();
		var fecha_fin = $( ".datepicker_fecha_fin" ).val();
    	
		var fecha_ini_anio = fecha_ini.substring(0, 4);
		var fecha_ini_mes = fecha_ini.substring(5, 7);
		var fecha_ini_dia = fecha_ini.substring(8, 10);

		var fecha_fin_anio = fecha_fin.substring(0, 4);
		var fecha_fin_mes = fecha_fin.substring(5, 7);
		var fecha_fin_dia = fecha_fin.substring(8, 10);

		var texto="n";

		if(fecha_ini_anio != fecha_fin_anio){
			texto = fecha_ini_dia + " de " + convertirMes(fecha_ini_mes) + " del " + fecha_ini_anio + " al " + fecha_fin_dia + " de "+convertirMes(fecha_fin_mes) + " del " + fecha_fin_anio;
		}
		else{

			if(fecha_ini_mes != fecha_fin_mes){
				texto = fecha_ini_dia+" de "+convertirMes(fecha_ini_mes) +" al " + fecha_fin_dia + " de "+convertirMes(fecha_fin_mes) + " del " + fecha_fin_anio;
			}
			else{

				if(fecha_ini_dia != fecha_fin_dia){
					texto = fecha_ini_dia+" al " + fecha_fin_dia + " de "+convertirMes(fecha_fin_mes) + " del " + fecha_fin_anio;
				}
				else{
					
					texto = fecha_fin_dia + " de "+convertirMes(fecha_ini_mes) + " del " + fecha_fin_anio;	
				}
			}
		}
		//alert(texto);
		$(".texto_fecha").text(texto);
		
    }
	
	
	//== EJECUCION DE FUNCIONES ===========================================================================================================
    //crearListaAnios();
    
    //inicializamos selec de ZT
    initZT($("#zona_operacion").val());

    //inicializamos valor de los date picker de busqueda
    $( ".datepicker_fecha_ini" ).datepicker( "setDate", $("#fecha_busqueda_ini_default").val() );
	$( ".datepicker_fecha_fin" ).datepicker( "setDate", $("#fecha_busqueda_fin_default").val() );
	$( ".datepicker_fecha_ini , .datepicker_fecha_fin" ).datepicker( "option", "yearRange", $(fecha_anio_actual).val()+":c+10" ); //definimos como inicio el año actual. ejemplo 2021


	//inicializar textos de año.datepicker_fecha_ini , s
	$( ".anio_actual").text($("#fecha_anio_actual").val());
	$( "#anio_previo").text( parseInt($("#fecha_anio_actual").val())-1);


	//calcularTextoFecha($("#fecha_busqueda_ini_default").val(), $("#fecha_busqueda_fin_default").val());
	calcularTextoFecha();

	//ocultamos la animacion de carga
	 $("#wait").css("display", "none");
		
		  
});//end jquery.ready
		  





function mostrarProrrogas(id_lic,num_lic){

	var contador=0;
	$( "#tabla_prorrogas tbody tr" ).each(function( index ) {
		
		 var c_lic = $(this).attr("proroga_lic");
		 if(c_lic!=id_lic){
		 	$(this).css("display","none");
		 }
		 else{
		 	contador++;
		 	$(this).css("display","");
		 	//$(this).find("td");	
		 	$(this).children('td:nth(0)').text(contador);  
		 }

		  
	});

	//$('#modal_contenedor_prorrogas span .p_num_lic').text(num_lic);
	$(".p_num_lic").html(num_lic);

	$('#modal_contenedor_prorrogas').modal('show');	
}
