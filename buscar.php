<?php

session_start();


header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

$fecha_busqueda_ini = NULL;
$fecha_busqueda_fin = NULL;

$fecha_anio_actual = NULL;

 
 
 /** strtotime es una funcion que metiendo un string descriptivo del tiempo (en ingles) regresa una estampa de tiempo equivalente.
 (strtotime — Parse about any English textual datetime description into a Unix timestamp)
 
 Los argumntos que puede manejar son los siguientes:
 3 days ago
Saturday 23rd January (2021-01-23)
-3 days
Saturday 23rd January (2021-01-23)
-2 days
Sunday 24th January (2021-01-24)
yesterday
Monday 25th January (2021-01-25)
now
Tuesday 26th January (2021-01-26)
today
Tuesday 26th January (2021-01-26)
tomorrow
Wednesday 27th January (2021-01-27)
+2 days
Thursday 28th January (2021-01-28)
+3 days
Friday 29th January (2021-01-29)


-2 weeks Saturday
Saturday 16th January (2021-01-16)
last Saturday
Saturday 23rd January (2021-01-23)
Saturday
Saturday 30th January (2021-01-30)
this Saturday
Saturday 30th January (2021-01-30)
first Saturday
Saturday 30th January (2021-01-30)
next Saturday
Saturday 30th January (2021-01-30)
third Saturday
Saturday 13th February (2021-02-13)
+2 weeks Saturday
Saturday 13th February (2021-02-13)
 **/
 
 //para este caso el dia de calculo por defaul lo inicializamos como el ultimo jueves tomando como referencia el dia de hoy
$fecha_busqueda_ini_default = date('Y-m-d', strtotime("last Thursday"));
$fecha_busqueda_fin_default = date('Y-m-d');

$fecha_anio_actual = date('Y'); //año actual

?>

<html>
<head>
<meta charset="UTF-8">
<title>Licencias Vigentes y Vencidas de Relieve - ZOTGM</title>
    <link type="text/css" rel="stylesheet" href="jquery-ui-1.12.1/jquery-ui.min.css">
	<link type="text/css" rel="stylesheet" href="jquery-ui-1.12.1/jquery-ui.theme.min.css">
	
	<link type="text/css" rel="stylesheet" href="bootstrap-4.6.0-dist/css/bootstrap.min.css">

	<link type="text/css" rel="stylesheet" href="css/buscar.css">
	
	<script src="jquery/jquery-3.5.1.min.js"></script>
	<script src="jquery-ui-1.12.1/jquery-ui.min.js"></script>
	<script src="bootstrap-4.6.0-dist/js/bootstrap.bundle.min.js"></script>
	
	<script type="text/javascript" src="my_js/generar_descargar_tabla_CSV.js"></script>
	<script type="text/javascript" src="my_js/buscar.js"></script>

</head>
<body>

<input type="hidden" id="fecha_busqueda_ini_default" value="<?php echo $fecha_busqueda_ini_default; ?>" />
<input type="hidden" id="fecha_busqueda_fin_default" value="<?php echo $fecha_busqueda_fin_default; ?>" />
<input type="hidden" id="fecha_anio_actual" value="<?php echo $fecha_anio_actual; ?>" />



<!--div id="wait" style="display:block; position:absolute; top:50%; left:50%; border-radius: 25px; text-align: center; width:150px; height:150px; background-color: black;  padding:2px; z-index: 10000; padding: 30px 30px 30px 30px;"-->
<div id="wait" style="display:block; position:absolute; top:0%; left:0%; width: 100%; height:100%; z-index: 10000;">
	<div id="wait" style="display:block; position:absolute; width: 100%; height:100%; background-color: white; opacity: 0.8;">
		<!--FONDO QUE CUBRE TODA LA PANTALLAS--->
	</div>
	<div style="display:block; position:absolute; top:50%; left:50%;">
		<div style="display:block; position:relative; left:-50%; border-radius: 25px; text-align: center; width:150px; height:150px; background-color: black; padding:2px; padding: 30px 30px 30px 30px;">
			<img src='images/demo_wait.gif' width="64" height="64" />
			<br>
			<span style="color: white;">Cargando...</span>
		</div>
	</div>
</div>


<!--ENCABEZADO ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------>
<div style="width: 100%; background-color: black;">
	<div class="container" >
	  <div class="row" style="background-color: black;">
	    <div class="col-sm-2" style="padding: 15px 10px 10px 10px;">
	      		<img src="images/CFE_logo_invertido2.jpg" style="width: 180px;" >
	    </div>
	    <div class="col-sm-8" style="padding: 10px 10px 10px 10px; text-align: center; color: white;">
			<div style="font-size: 18px; font-weight: bold; color: #00A969">Gerencia Regional de Transmisión Central</div>
			<div style="font-size: 18px; font-weight: bold;  color: #8DC63F;">Zona de Operación de Transmisión Guerrero Morelos</div>
	    	<div style="font-size: 20px;">Licencias Abiertas (<span style="color: #27AE60; font-weight: bold;">Vigentes</span> y <span style="color:red; font-weight: bold;">Vencidas</span>) de Relieve - ZOTGM y ZOTPTX</div>
	      		
	    </div>
	    <div class="col-sm-2" style="padding: 5px 5px 5px 5px; text-align: right;">
	      		<img src="images/logo_zotgm.jpg" style="width: 120px;">
	    </div>
	  </div>
	</div>
</div>

	
	<div id="dialogo_busqueda" style="font-size: 14; text-align: center; padding: 5px 10px 1px 10px; background-color: #7799ff; ">
		
		<form method="get" action="#" >
		
			<div class="container">
				  <div class="row">
						<div class="col-sm-2">
			              <span>Zona de Operación</span>
			                <div style="display: block; border: 1px solid #0000FF;">
			                  <div style="padding: 5px 5px 5px 5px;">
			                    <select id="zona_operacion"  style="text-align: center; width: 80px; " >
			                      <option value="ZOTGM" selected>ZOTGM</option>
			                      <option value="ZOTPTX">ZOTPTX</option>
			                      <option value="ZOTTLC">ZOTTLC</option>
			                    </select>
			                  </div>
			                </div>
						</div>

						<div class="col-sm-2">
			              <span>Zona de Transmisión</span>
			                <div style="display: block; border: 1px solid #0000FF;">
			                  
			                  <div style="padding: 5px 5px 5px 5px;">
			                    <select id="zona_transmision"  style="text-align: center; width: 130px; " >
			                    </select>
			                  </div>
			                </div>
						</div>
						
						<div class="col-sm-6">
							<span>Periodo de búsqueda</span>
							<div style="display: block; border: 1px solid #0000FF;">
								<div style="padding: 5px 5px 5px 5px;">
									<span>Fecha Inicial:&nbsp;</span>
									<input type="text" id="busqueda_fecha_ini" class="datepicker_fecha_ini" style="text-align: center; width: 120px; margin-right: 3px;" value="" placeholder="YYYY-MM-DD"/>
									&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
									<span>Fecha Final:&nbsp;</span>
									<input type="text" id="busqueda_fecha_fin" class="datepicker_fecha_fin" style="text-align: center; width: 120px; margin-right: 3px;"  value=""  placeholder="YYYY-MM-DD"/>
								</div>
							</div>						
						</div>
						
						<div class="col-sm-2">
							<span>&nbsp;</span>
			                  <div style="display: block; border: 1px solid #0000FF;">
				                  <div style="padding: 5px 5px 5px 5px;">
					                  <!--input type="button" id="btn_buscar_solicitudes" value="Buscar" style="width:100px; height: 60px;" / -->
					                  <input type="button" id="btn_buscar_solicitudes" value="Buscar" style="width: 80px; height: 30px; font-weight: bold;"/>&nbsp;&nbsp;
					                  <input type="button" id="btn_restablecer_campos" value="Rest."  style="width: 50px; height: 25px; font-weight: bold; font-size: 10px;" alt="Restablecer fechas"/>  
				                  </div>
							</div>
				  		</div>
				</div>
			</div>
		
		</form>
		
	</div>
		



<div class="container-fluid" style="font-weight: bold; font-size: 16px; padding: 10px 10px 10px 10px;">
  <div class="row">
    <div class="col-sm-9">
      <span>Búsqueda: </span><span id="titulo_busqueda"></span>
    </div>
    <div class="col-sm-3">
      Horario de la búsqueda: <span id="date_time_busqueda"></span>
    </div>
  </div>
</div>
	

<div id="tabs">
  <ul>
    <li><a href="#tabs-1">Estadística</a></li>
    <li><a href="#tabs-2">Licencias Abiertas de años anteriores (<span id="span_contador_anteriores_este_anio">0</span>)</a></li>
    <li><a href="#tabs-3">Licencias Abiertas año <span class="anio_actual"></span> - Antes del rango de fechas (<span id="span_contador_este_anio_antes_rango">0</span>)</a></li>
    <li><a href="#tabs-4">Licencias Abiertas año <span class="anio_actual"></span> - En rango de fechas (<span id="span_contador_este_anio_en_rango">0</span>)</a></li>
  </ul>
  <div id="tabs-1">
     <table id="tbl_estadistica">
        <thead>
          <tr>
            <th rowspan="3" style="font-size: 12px;">Especialidad</th>
            <th colspan="4" style="font-size: 14px;">Licencias Abiertas</th>
            <th colspan="5" style="font-size: 14px;">Licencias Año <span class="anio_actual"></span></th>
            <th style="font-size: 14px;">Licencias Totales Abiertas</th>
          </tr>
          <tr>
            
            <th colspan="2">De años anteriores al <span class="anio_actual"></span></th>
            <th colspan="2">Atendidas del <span class="texto_fecha"></span> (de años anteriores)</th>
            <th rowspan="2">Otorgadas del <span class="texto_fecha"></span></th>
            <th rowspan="2">Atendidas del <span class="texto_fecha"></span></th>
            <th colspan="2">Abiertas del periodo del <span class="texto_fecha"></span></th>
            <th rowspan="2">Abiertas Acumuladas en el año <span class="anio_actual"></span></th>
            <th rowspan="2">Licencias Abiertas acumuladas(años anteriores + <span class="anio_actual"></span>)TOTALES</th>
          </tr>
          <tr>
            <th style="font-size: 10px;">VENCIDAS</th>
            <th style="font-size: 10px;">VIGENTES</th>
            <th style="font-size: 10px;">VENCIDAS</th>
            <th style="font-size: 10px;">VIGENTES</th>
            <th style="font-size: 10px;">VENCIDAS</th>
            <th style="font-size: 10px;">VIGENTES</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>SUBESTACIONES</td>
            <td id="subestaciones1">&nbsp;</td>
            <td id="subestaciones2">&nbsp;</td>
            <td id="subestaciones3">&nbsp;</td>
            <td id="subestaciones4">&nbsp;</td>
            <td id="subestaciones5">&nbsp;</td>
            <td id="subestaciones6">&nbsp;</td>
            <td id="subestaciones7">&nbsp;</td>
            <td id="subestaciones8">&nbsp;</td>
            <td id="subestaciones9">&nbsp;</td>
            <td id="subestaciones10">&nbsp;</td>
          </tr>
          <tr>
            <td>LINEAS</td>
            <td id="lineas1">&nbsp;</td>
            <td id="lineas2">&nbsp;</td>
            <td id="lineas3">&nbsp;</td>
            <td id="lineas4">&nbsp;</td>
            <td id="lineas5">&nbsp;</td>
            <td id="lineas6">&nbsp;</td>
            <td id="lineas7">&nbsp;</td>
            <td id="lineas8">&nbsp;</td>
            <td id="lineas9">&nbsp;</td>
            <td id="lineas10">&nbsp;</td>
          </tr>
          <tr>
            <td>PROTECCIÓN Y MEDICIÓN</td>
            <td id="protecciones1">&nbsp;</td>
            <td id="protecciones2">&nbsp;</td>
            <td id="protecciones3">&nbsp;</td>
            <td id="protecciones4">&nbsp;</td>
            <td id="protecciones5">&nbsp;</td>
            <td id="protecciones6">&nbsp;</td>
            <td id="protecciones7">&nbsp;</td>
            <td id="protecciones8">&nbsp;</td>
            <td id="protecciones9">&nbsp;</td>
            <td id="protecciones10">&nbsp;</td>
          </tr>

          <tr>
            <td>COMUNICACIONES</td>
            <td id="comunicaciones1">&nbsp;</td>
            <td id="comunicaciones2">&nbsp;</td>
            <td id="comunicaciones3">&nbsp;</td>
            <td id="comunicaciones4">&nbsp;</td>
            <td id="comunicaciones5">&nbsp;</td>
            <td id="comunicaciones6">&nbsp;</td>
            <td id="comunicaciones7">&nbsp;</td>
            <td id="comunicaciones8">&nbsp;</td>
            <td id="comunicaciones9">&nbsp;</td>
            <td id="comunicaciones10">&nbsp;</td>
          </tr>

          <tr>
            <td>CONTROL</td>
            <td id="control1">&nbsp;</td>
            <td id="control2">&nbsp;</td>
            <td id="control3">&nbsp;</td>
            <td id="control4">&nbsp;</td>
            <td id="control5">&nbsp;</td>
            <td id="control6">&nbsp;</td>
            <td id="control7">&nbsp;</td>
            <td id="control8">&nbsp;</td>
            <td id="control9">&nbsp;</td>
            <td id="control10">&nbsp;</td>
          </tr>
        </tbody>
      </table>
  </div>
  
  
  <div id="tabs-2">
  
	<!--button id="btn_generar_csv_licencias_anteriores">Generar CSV de Licencias antes del <span class="anio_actual"></span></button-->
	<button id="btn_generar_csv_licencias_anteriores" class="boton_csv"><image src="images\csv_icon2.png" />Licencias antes del <span class="anio_actual"></span></button>

	<table id='tabla_licencias_anteriores' class='table tabla_res my_table'>
		<thead>
			<tr>
	              <th>#</th>
	              <th>ESTADO</th>
	              <th style='/*min-width: 110px;*/'>NUM LICENCIA <!--LICENSE NUM--></th>
	              <th style='/*min-width: 110px;*/'>FECHA OTORGADA<!--GRANTING DATE--></th>
	              <th style='/*min-width: 110px;*/'>FECHA VENCIMIENTO<!--PLANNED EDATE--></th>
	              <th>VIGENCIA / VENCIMIENTO<!--DIAS DE VENCIMIENTO--></th>
	              <th>S.E.<!--SUBSTATION NAME--></th>
	              <th style='min-width: 105px;'>EQUIPO<!--EQP TYPE, EQP SHORT NAME--></th>
	              <th>DEPARTAMENTO<!--DEPARTMENT--></th>
	              <th>TRABAJOS<!--WORK OBJECTIVES--></th>
	              <th>Indicar la razon por la cual la licencia esta VENCIDA</th>
	              <th>Acciones que se estan realizando</th>
	              <th>SOLICITUD <!--APP NUM--></th>
	              <th>VIVO / MUERTO<!--DEAD OR ALIVE--></th>
	              
	              <th>RESPONSABLE<!--RESPONSIBLE FOR WORK EMP ID--></th>
	              <th>TIPO DE LICENCIA<!--LICENSE TYPE ID--></th>
	              <th>PRORROGAS</th>
	      	</tr>
		</thead>
		<tbody>
		</tbody>
	</table>
    
  </div> <!-- end TAB-2-->

  
  <!-- end TAB-3-------------------------------------------------------------------------------------------------------->
  <div id="tabs-3">
          
  <!--button id="btn_generar_csv_licencias_anio_actual_antes_rango_fechas">Generar CSV de Licencias del <span class="anio_actual"></span> antes del rango de fechas</button-->
  <button id="btn_generar_csv_licencias_anio_actual_antes_rango_fechas" class="boton_csv"><image src="images\csv_icon2.png" />Licencias del <span class="anio_actual"></span> antes del rango de fechas</button>
  
  	<table id='tabla_licencias_este_anio_antes_de_rango' class='table tabla_res my_table'>
		<thead>
			<tr>
	              <th>#</th>
	              <th>ESTADO</th>
	              <th>NUM LICENCIA <!--LICENSE NUM--></th>
	              <th>FECHA OTORGADA<!--GRANTING DATE--></th>
	              <th>FECHA VENCIMIENTO</th>
	              <th>VIGENCIA / VENCIMIENTO<!--DIAS DE VENCIMIENTO--></th>
	              <th>S.E.<!--SUBSTATION NAME--></th>
	              <th style='min-width: 105px;'>EQUIPO<!--EQP TYPE, EQP SHORT NAME--></th>
	              <th>DEPARTAMENTO<!--DEPARTMENT--></th>
	              <th>TRABAJOS<!--WORK OBJECTIVES--></th>
	              <th>Indicar la razon por la cual la licencia esta VENCIDA</th>
	              <th>Acciones que se estan realizando</th>
	              <th>SOLICITUD <!--APP NUM--></th>
	              <th>VIVO / MUERTO<!--DEAD OR ALIVE--></th>
	              <th>RESPONSABLE<!--RESPONSIBLE FOR WORK EMP ID--></th>
	              <th>TIPO DE LICENCIA<!--LICENSE TYPE ID--></th>
	              <th>PRORROGAS</th>
	      	</tr>
		</thead>
		<tbody>
		</tbody>
	</table>

  </div> <!-- End tab-3 -->


  <!-- end TAB-3-------------------------------------------------------------------------------------------------------->
  <div id="tabs-4">
  
  <!--button id="btn_generar_csv_licencias_anio_actual_en_rango_fechas">Generar CSV de Licencias del <span class="anio_actual"></span> en Rango de fechas</button -->
  <button id="btn_generar_csv_licencias_anio_actual_en_rango_fechas" class="boton_csv"><image src="images\csv_icon2.png" />Licencias del <span class="anio_actual"></span> en Rango de fechas</button>
  
  <table id='tabla_licencias_este_anio_en_rango' class='table tabla_res my_table'>
		<thead>
			<tr>
	              <th>#</th>
	              <th>ESTADO</th>
	              <th>NUM LICENCIA <!--LICENSE NUM--></th>
	              <th>FECHA OTORGADA<!--GRANTING DATE--></th>
	              <th>FECHA VENCIMIENTO / TERMINO<!--PLANNED EDATE--></th>
	              <th>VIGENCIA / VENCIMIENTO<!--DIAS DE VENCIMIENTO--></th>
	              <th>S.E.<!--SUBSTATION NAME--></th>
	              <th style='min-width: 105px;'>EQUIPO<!--EQP TYPE, EQP SHORT NAME--></th>
	              <th>DEPARTAMENTO<!--DEPARTMENT--></th>
	              <th>TRABAJOS<!--WORK OBJECTIVES--></th>
	              <th>Indicar la razon por la cual la licencia esta VENCIDA</th>
	              <th>Acciones que se estan realizando</th>
	              <th>SOLICITUD <!--APP NUM--></th>
	              <th>VIVO / MUERTO<!--DEAD OR ALIVE--></th>
	              
	              <th>RESPONSABLE<!--RESPONSIBLE FOR WORK EMP ID--></th>
	              <th>TIPO DE LICENCIA<!--LICENSE TYPE ID--></th>
	              <th>PRORROGAS</th>
	      </tr>
		</thead>
		<tbody>
		</tbody>
	</table>
  </div> <!-- End tab-4 -->


  
</div> <!--END DIV TABS-->
	

<!--modal ----------------------------------------------------------------------------------------------------------------------------------------------------->



<!-- Modal -->
<div class="modal fade" id="modal_contenedor_prorrogas" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Prorrogas de la Licencia <span class="p_num_lic">0</span></h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
     
      		<table id="tabla_prorrogas" class='table tabla_res  my_table'>
      			<thead>
      				<tr>
      					<th>#</th>
						<th style='min-width: 105px;'>DIA DE LA PRORROGA</th>
						<th style='min-width: 105px;'>FECHA INICIAL</th>
						<th style='min-width: 105px;'>FECHA FINAL</th>
						<th>CAUSA</th>
      				</tr>
      			</thead>
      			<tbody></tbody>
      		</table>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
      </div>
    </div>
  </div>
</div>



	
</body>
</html>