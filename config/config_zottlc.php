<?php 

	//NOTA: Las conexiones a base de datos oracle se hacen a traves del OracleDataprovider, 
	//por lo qie se ocupa una referencia de conexion "SID" configurada en TNSNAMES.ORA
	//NOTA2: El SID debe ser el nombre original de la base de datos (como esta definido el servicio) y no como el alias.
	$db_zottlc_sid = "DBE.TLCORA01";
	$db_zottlc_usuario = "rel";
	$db_zottlc_password = "rel";


	$query_zottlc_lic_anios_anteriores = "SELECT 
								t_applications.SUBSTATION_NAME,	
								t_applications.EQP_TYPE,
								t_applications.EQP_SHORT_NAME,
								t_applications.APP_NUM,
								t_applications.DEAD_OR_ALIVE,
								to_char(t_applications.PLANNED_SDATE,'yyyy-MM-dd hh24:MI') as PLANNED_SDATE,
								to_char(t_applications.PLANNED_EDATE,'yyyy-MM-dd hh24:MI') as PLANNED_EDATE,
								t_applications.WORK_OBJECTIVES,
								t_applications.RESPONSIBLE_FOR_WORK_EMP_ID,	
								-- SUBSTR(RESPONSIBLE_FOR_WORK_EMP_ID,5,3) AS ZT,
								SUBSTR(t_applications.DEPARTMENT,3) AS DEPARTAMENTO,
								t_licenses.LICENSE_ID,
								t_licenses.LICENSE_NUM,
								t_licenses.LICENSE_TYPE_ID,
								to_char(t_licenses.GRANTING_DATE,'yyyy-MM-dd hh24:MI') as GRANTING_DATE,
								to_char(t_licenses.LIC_REMOVAL_DATE,'yyyy-MM-dd hh24:MI') as LIC_REMOVAL_DATE,
								t_applications.current_app_status,
								to_char(t_applications.CANCEL_DATE,'yyyy-MM-dd hh24:MI') as CANCEL_DATE,
								t_applications.CANCEL_COMMENT,
							    c_external_users.DEPT as ESPECIALIDAD, 
							    TRUNC (CURRENT_DATE - t_applications.PLANNED_EDATE, 0) as DIAS_VENCIMIENTO,
							    CASE WHEN CURRENT_DATE > t_applications.PLANNED_EDATE 
							        THEN  'VENCIDA' ELSE 'VIGENTE' END AS ESTADO,
							    CASE WHEN LIC_REMOVAL_DATE IS NULL AND  CURRENT_DATE < t_applications.PLANNED_EDATE 
							        THEN TRUNC (CURRENT_DATE - t_LICENSES.GRANTING_DATE, 0)  
							        ELSE NULL END AS DIAS_VIGENTE 
								FROM 
									t_applications
									LEFT OUTER JOIN  t_licenses ON t_licenses.license_id = t_applications.license_id
								    INNER JOIN c_external_users ON c_external_users.EMP_ID = t_applications.RESPONSIBLE_FOR_WORK_EMP_ID
								WHERE             
								    CURRENT_APP_STATUS = 60  -- licencias concedidas
								   --AND c_external_users.ZONE LIKE '%" . $zona_transmision . "%' 
								   AND PLANNED_SDATE <= to_date('2020-12-31','yyyy-MM-dd') 
									AND c_external_users.ZONE LIKE '%TRANS%'      -- SE O
								    AND LIC_REMOVAL_DATE IS NULL                           -- sin fecha de retiro 
								    ORDER BY ESTADO ASC, SUBSTR(RESPONSIBLE_FOR_WORK_EMP_ID, 0,5) ASC, c_external_users.DEPT ASC, GRANTING_DATE ASC
								";




	

	//== BUSQUEDA PARA REGISTROS ESTE ANIO ANTES RANGO ====================================================================================		
	
	$query_zottlc_lic_este_anio_antes_rango = "SELECT 
											t_applications.SUBSTATION_NAME,	
											t_applications.EQP_TYPE,
											t_applications.EQP_SHORT_NAME,
											t_applications.APP_NUM,
											t_applications.DEAD_OR_ALIVE,
											to_char(t_applications.PLANNED_SDATE,'yyyy-MM-dd hh24:MI') as PLANNED_SDATE,
											to_char(t_applications.PLANNED_EDATE,'yyyy-MM-dd hh24:MI') as PLANNED_EDATE,
											t_applications.WORK_OBJECTIVES,
											t_applications.RESPONSIBLE_FOR_WORK_EMP_ID,	
											SUBSTR(t_applications.DEPARTMENT,3) AS DEPARTAMENTO,
											t_licenses.LICENSE_ID, 
											t_licenses.LICENSE_NUM,
											t_licenses.LICENSE_TYPE_ID,
											to_char(t_licenses.GRANTING_DATE,'yyyy-MM-dd hh24:MI') as GRANTING_DATE,
											to_char(t_licenses.LIC_REMOVAL_DATE,'yyyy-MM-dd hh24:MI') as LIC_REMOVAL_DATE,
											t_applications.current_app_status,
											to_char(t_applications.CANCEL_DATE,'yyyy-MM-dd hh24:MI') as CANCEL_DATE,
											t_applications.CANCEL_COMMENT,
										    c_external_users.DEPT as ESPECIALIDAD, 
										    TRUNC (CURRENT_DATE - t_applications.PLANNED_EDATE, 0) as DIAS_VENCIMIENTO,
										    CASE WHEN CURRENT_DATE > t_applications.PLANNED_EDATE 
										        THEN  'VENCIDA' ELSE 'VIGENTE' END AS ESTADO,
										    CASE WHEN LIC_REMOVAL_DATE IS NULL AND  CURRENT_DATE < t_applications.PLANNED_EDATE 
										        THEN TRUNC (CURRENT_DATE - t_LICENSES.GRANTING_DATE, 0)  
										        ELSE NULL END AS DIAS_VIGENTE 
											FROM 
												t_applications
												LEFT OUTER JOIN  t_licenses ON t_licenses.license_id = t_applications.license_id
											    INNER JOIN c_external_users ON c_external_users.EMP_ID = t_applications.RESPONSIBLE_FOR_WORK_EMP_ID
											WHERE             
											    CURRENT_APP_STATUS = 60  -- licencias concedidas
											    -- AND SUBSTR(RESPONSIBLE_FOR_WORK_EMP_ID, 1,7) ='" . $zona_transmision . "' 
											    AND PLANNED_SDATE >= to_date('2021-01-01','yyyy-MM-dd') 
												AND PLANNED_SDATE < to_date('".$busqueda_fecha_ini."','yyyy-MM-dd')
												AND c_external_users.ZONE LIKE '%TRANS%'      -- SE O
											    AND LIC_REMOVAL_DATE IS NULL                           -- sin fecha de retiro 
											    ORDER BY ESTADO ASC, SUBSTR(RESPONSIBLE_FOR_WORK_EMP_ID, 0,5) ASC, c_external_users.DEPT ASC, GRANTING_DATE ASC
											";

	
	



	//== BUSQUEDA PARA REGISTROS ESTE ANIO EN RANGO ====================================================================================		
	$query_zottlc_lic_este_anio_en_rango = "SELECT 
											t_applications.SUBSTATION_NAME,	
											t_applications.EQP_TYPE,
											t_applications.EQP_SHORT_NAME,
											t_applications.APP_NUM,
											t_applications.DEAD_OR_ALIVE,
											to_char(t_applications.PLANNED_SDATE,'yyyy-MM-dd hh24:MI') as PLANNED_SDATE,
											to_char(t_applications.PLANNED_EDATE,'yyyy-MM-dd hh24:MI') as PLANNED_EDATE,
											t_applications.WORK_OBJECTIVES,
											t_applications.RESPONSIBLE_FOR_WORK_EMP_ID,	
											SUBSTR(t_applications.DEPARTMENT,3) AS DEPARTAMENTO, 
											t_licenses.LICENSE_ID,
											t_licenses.LICENSE_NUM,
											t_licenses.LICENSE_TYPE_ID,
											to_char(t_licenses.GRANTING_DATE,'yyyy-MM-dd hh24:MI') as GRANTING_DATE, 
											to_char(t_licenses.LIC_REMOVAL_DATE,'yyyy-MM-dd hh24:MI') as LIC_REMOVAL_DATE, 
											t_applications.current_app_status, 
											to_char(t_applications.CANCEL_DATE,'yyyy-MM-dd hh24:MI') as CANCEL_DATE, 
											t_applications.CANCEL_COMMENT,
											c_external_users.DEPT as ESPECIALIDAD, 
											TRUNC (CURRENT_DATE - t_applications.PLANNED_EDATE, 0) as DIAS_VENCIMIENTO, 
											 CASE WHEN LIC_REMOVAL_DATE IS NULL THEN 
											    CASE WHEN CURRENT_DATE > t_applications.PLANNED_EDATE   THEN  'VENCIDA' ELSE 'VIGENTE' END
											 ELSE 'TERMINADA' END AS ESTADO,
											  
											 CASE WHEN LIC_REMOVAL_DATE IS NULL AND  CURRENT_DATE < t_applications.PLANNED_EDATE THEN 
											    TRUNC (CURRENT_DATE - t_LICENSES.GRANTING_DATE, 0)  
											 ELSE NULL END AS DIAS_VIGENTE 

											FROM t_applications
												LEFT OUTER JOIN  t_licenses ON t_licenses.license_id = t_applications.license_id
												INNER JOIN c_external_users ON c_external_users.EMP_ID = t_applications.RESPONSIBLE_FOR_WORK_EMP_ID

											WHERE

											CURRENT_APP_STATUS = 60  
											--AND SUBSTR(RESPONSIBLE_FOR_WORK_EMP_ID, 1,7) ='" . $zona_transmision . "' 
									   		AND PLANNED_SDATE >= to_date('".$busqueda_fecha_ini." 00:00:00','yyyy-MM-dd HH24:MI:SS') 
											AND PLANNED_SDATE <= to_date('".$busqueda_fecha_fin." 23:59:59','yyyy-MM-dd HH24:MI:SS') 
											AND c_external_users.ZONE LIKE '%TRANS%'      -- SE O
											-- AND LIC_REMOVAL_DATE IS NULL               			-- sin fecha de retiro 
											-- ORDER BY ESTADO ASC, SUBSTR(RESPONSIBLE_FOR_WORK_EMP_ID, 0,5) ASC, c_external_users.DEPT ASC, GRANTING_DATE ASC
											ORDER BY ESTADO ASC, c_external_users.DEPT ASC, GRANTING_DATE ASC
											";





?>
