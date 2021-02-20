<?php
session_start();


header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");





//funcion para traer las prorrogas segun el conjunto de licencias
function obtenerProrrogas($conn, $records)
{
	$estado = 0;
    $records_prorrogas="";
	for($i=0 ; $i< count($records) ; $i++){
		$query_prorrogas = "SELECT 
							LICENSE_ID,	
							to_char(PROLONG_DATE,'yyyy-MM-dd hh24:MI') as PROLONG_DATE, 	
							to_char(FROM_EDATE,'yyyy-MM-dd hh24:MI') as FROM_EDATE,
							to_char(TO_EDATE,'yyyy-MM-dd hh24:MI') as TO_EDATE,
							PROLONG_CAUSE
							FROM
								t_prolong_license_log			
							WHERE             
							    LICENSE_ID = ".$records[$i]['LICENSE_ID']."
							ORDER BY PROLONG_DATE ASC";
		$stid_p = oci_parse($conn, $query_prorrogas );
		oci_execute($stid_p);

		while ($row = oci_fetch_array($stid_p, OCI_ASSOC+OCI_RETURN_NULLS)) { 
			$records_prorrogas[] = $row; //auntomaticamente se van agregando elementos al arreglo
		}//end while
	}
	return $records_prorrogas;
}



//funcion para traer las prorrogas segun el conjunto de licencias
function obtenerLicencias($conn, $query)
{
	$stid = oci_parse($conn, $query );
	oci_execute($stid);

	$records = null;
	while ($row = oci_fetch_array($stid, OCI_ASSOC+OCI_RETURN_NULLS)) {
		$records[] = $row; //auntomaticamente se van agregando elementos al arreglo
	}//end while

	return $records;
}



if( isset($_POST['datos'])&& !empty($_POST['datos'])  ){
	
	
	
	$db_sid  = "";
	$db_usuario  = "";
    $db_password = "";
    
	
	//Takes a JSON encoded string and converts it into a PHP variable.
	$datos = json_decode($_POST['datos']); 

	//obtenemos datos de llegada
	$zona_operacion 	= $datos->zona_operacion;
	$zona_transmision 	= $datos->zona_transmision;
	$busqueda_fecha_ini = $datos->busqueda_fecha_ini;
	$busqueda_fecha_fin = $datos->busqueda_fecha_fin;

	//AGREGAMOS ARCHIVO DE CONFIGURACION
	require "config\\config_zotgm.php";
	require "config\\config_zotptx.php";
	require "config\\config_zottlc.php";

	//evaluamos la zona de operacion
	if($zona_operacion=="ZOTGM"){
		
		$db_sid      = $db_zotgm_sid;
		$db_usuario  = $db_zotgm_usuario;
		$db_password = $db_zotgm_password;	

		$query_lic_anios_anteriores 	 = $query_zotgm_lic_anios_anteriores;
		$query_lic_este_anio_antes_rango = $query_zotgm_lic_este_anio_antes_rango;
		$query_lic_este_anio_en_rango    = $query_zotgm_lic_este_anio_en_rango;	
	}
	else if($zona_operacion=="ZOTPTX"){
		$db_sid      = $db_zotptx_sid;
		$db_usuario  = $db_zotptx_usuario;
		$db_password = $db_zotptx_password;

		$query_lic_anios_anteriores = $query_zotptx_lic_anios_anteriores;
		$query_lic_este_anio_antes_rango = $query_zotptx_lic_este_anio_antes_rango;
		$query_lic_este_anio_en_rango    = $query_zotptx_lic_este_anio_en_rango;
	}
	else if($zona_operacion=="ZOTTLC"){
		$db_sid      = $db_zottlc_sid;
		$db_usuario  = $db_zottlc_usuario;
		$db_password = $db_zottlc_password;

		$query_lic_anios_anteriores      = $query_zottlc_lic_anios_anteriores;
		$query_lic_este_anio_antes_rango = $query_zottlc_lic_este_anio_antes_rango;
		$query_lic_este_anio_en_rango    = $query_zottlc_lic_este_anio_en_rango;
	}
	
	//$myObj = (object)[]; // Cast empty array to object
	$conn = oci_pconnect($db_usuario, $db_password, $db_sid);
			
	//$conn = oci_connect('rel', 'rel', 'GMOORA1');
	//$conn = oci_pconnect('rel', 'rel', 'GMOORA1');
	

	if (!$conn) {
	    $e = oci_error();
	    trigger_error(htmlentities($e['message'], ENT_QUOTES), E_USER_ERROR);
	}

	
	

	//obtencion de licencias ---------------------------------------------------
	$myObj->records1 = obtenerLicencias($conn,$query_lic_anios_anteriores);
	$myObj->records2 = obtenerLicencias($conn,$query_lic_este_anio_antes_rango);
	$myObj->records3 = obtenerLicencias($conn,$query_lic_este_anio_en_rango);


	//$myObj->records1_prorrogas = obtenerProrrogas($conn, $records1);
	$myObj->records1_prorrogas = obtenerProrrogas($conn, $myObj->records1);
	$myObj->records2_prorrogas = obtenerProrrogas($conn, $myObj->records2);
	$myObj->records3_prorrogas = obtenerProrrogas($conn, $myObj->records3);

	
	 $myObj->zona_operacion = $zona_operacion;
	 $myObj->zona_transmision = $zona_transmision;
	 // $myObj->db_sid = $db_sid;
	 // $myObj->db_usuario = $db_usuario;
	 // $myObj->db_password = $db_password;
	  $myObj->busqueda_fecha_ini  = $busqueda_fecha_ini;
	  $myObj->busqueda_fecha_fin  = $busqueda_fecha_fin;
	
	$myObj->date_time_busqueda = date("Y-m-d H:i:s");

	//codificacion de datos de obj a json
	$myJSON = json_encode($myObj);

	

	echo $myJSON; //enviamos de regreso el objeto con estructura json
 }









?>