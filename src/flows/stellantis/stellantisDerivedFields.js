/**
 * Documentación y lógica para los campos derivados de Stellantis
 * que se usan para alimentar el diccionario final `mapeo_stella`.
 * 
 * Este adaptador traduce el objeto `c` (datos planos desde Google Sheets/formulario)
 * a las llaves esperadas en el PDF final.
 */

export const getDerivedFields = (c) => {
  // 1. Limpieza y nombres
  const nom = strUpper(c['Nombre(s) acreditado']);
  const pat = strUpper(c['Apellido Paterno acreditado']);
  const mat = strUpper(c['Apellido Materno acreditado']);
  const nombreCompletoFinal = `${nom} ${pat} ${mat}`.trim();

  // 2. Fecha y lugar nacimiento
  const fechaRaw = c['Fecha de Nacimiento'] || ''; // Esperado AAAA-MM-DD
  let dia = '';
  let mes = '';
  let anio = '';
  if (fechaRaw && fechaRaw.includes('-')) {
    const parts = fechaRaw.split('-');
    if (parts.length === 3) {
      anio = parts[0];
      mes = parts[1];
      dia = parts[2];
    }
  }

  // 3. Dirección Completa
  const calle = strUpper(c['Calle (solo nombre)']);
  const num_ext = strUpper(c['Numero exterior']);
  const num_int = strUpper(c['Numero interior']);
  const colonia = strUpper(c['Colonia acreditado']);
  const cp = c['Código Postal'] || '';
  const mun = strUpper(c['Municipio ó Alcaldía']);
  const edo = strUpper(c['Estado']);

  const direccionCompleta = `CALLE: ${calle} NO. EXT: ${num_ext}${num_int ? ' INT: ' + num_int : ''}, COLONIA: ${colonia}, C.P: ${cp}, MUNICIPIO: ${mun}, ESTADO: ${edo}`;

  return {
    dia,
    mes,
    anio,
    nom,
    pat,
    mat,
    nombreCompletoFinal,
    direccionCompleta,
    calle,
    num_ext,
    num_int,
    colonia,
    cp,
    mun,
    edo
  };
};

/**
 * Genera el mapeo_stella exacto usando el objeto plano `c`.
 * El objeto `c` usa los cabeceros de Google Sheets como llaves.
 */
export const buildMapeoStella = (c) => {
  const d = getDerivedFields(c);

  return {
    'nom_acre': d.nom,
    'ape_pat': d.pat,
    'ape_mat': d.mat,
    'rfc': strUpper(c['RFC']),
    'curp': strUpper(c['CURP']),
    'nacionalidad': strUpper(c['País de Nacimiento']),
    'estado_nacimiento': strUpper(c['Entidad Federativa de nacimiento']),
    'fech_lugar_nac': `${d.dia}/${d.mes}/${d.anio} - ${strUpper(c['Entidad Federativa de nacimiento'])}`,
    'tel_cel': strVal(c['Número Celular']),
    'com_telefonica': strUpper(c['Compañia telefonica']),
    'correo_elect': strLower(c['Correo Electrónico']),
    'calle': d.calle,
    'num_ext_int': `EXT: ${d.num_ext} INT: ${d.num_int}`,
    'colonia': strUpper(c['Colonia acreditado']),
    'codigo_postal': strVal(c['Código Postal']),
    'alcaldia_mun': strUpper(c['Municipio ó Alcaldía']),
    'estado': strUpper(c['Estado']),
    'ciudad_poblacion': strUpper(c['Ciudad o Población']),
    'tel_casa': strVal(c['Teléfono de casa fijo o celular']),
    'años_residencia': strVal(c['Años de vivir en su domicilio']),
    'ocupa_profesion': strUpper(c['¿Qué puesto o actividad desempeñas en tu trabajo?']),
    'nom-empresa': strUpper(c['Nombre de la Empresa ó Institución']),
    'giro_empresa': strUpper(c['¿A que se dedica la empresa donde laboras?']),
    'calle_empre': strUpper(c['Calle trabajo (solo el nombre)']),
    'num_ext_empre': strUpper(c['Numero exterior trabajo']),
    'colonia_empre': strUpper(c['Colonia trabajo']),
    'alcaldia_empresa': strUpper(c['Municipio ó Alcaldía trabajo']),
    'estado_empre': strUpper(c['Estado trabajo']),
    'codigo_post_empre': strUpper(c['Código Postal trabajo']),
    'tel_oficina': strVal(c['Teléfono de oficina y extensión ó directo']),
    'nom_jefe_inmediato': strUpper(c['Nombre de tu Jefe Inmediato']),
    'años_empre': strVal(c['Antigüedad en el empleo, negocio ó jubilado ó pensionado años']),
    
    // Referencia 1
    'ref1_nombre': `${strUpper(c['Nombre (solo nombre) referencia 1'])} ${strUpper(c['Apellido Paterno (solo nombre) referencia 1'])}`.trim(),
    'ref1_parentesco': strUpper(c['Parentesco ref 1']),
    'ref1_telefono': strVal(c['Teléfono de la Referencia 1']),
    'ref1_ocupacion': strUpper(c['Ocupacion de la referencia 1']),
    
    // Referencia 2
    'ref2_nombre': `${strUpper(c['Nombre (solo nombre) referencia 2'])} ${strUpper(c['Apellido Paterno (solo nombre) referencia 2'])}`.trim(),
    'ref2_parentesco': strUpper(c['Parentesco ref 2']),
    'ref2_telefono': strVal(c['Teléfono de la Referencia 2']),
    'ref2_ocupacion': strUpper(c['Ocupacion de la referencia 2']),
    
    // Referencia 3
    'ref3_nombre': `${strUpper(c['Nombre (solo nombre) referencia 3'])} ${strUpper(c['Apellido Paterno (solo nombre) referencia 3'])}`.trim(),
    'ref3_parentesco': strUpper(c['Parentesco ref 3']),
    'ref3_telefono': strVal(c['Teléfono de la Referencia 3']),
    'ref3_ocupacion': strUpper(c['Ocupacion de la referencia 3']),
    
    // Firmas / Finales
    'nom_final_sol': d.nombreCompletoFinal,
    'final_nombre1': d.nombreCompletoFinal,
    'final_rfc': strUpper(c['RFC']),
    'calle_final_sol': d.direccionCompleta,
    'final_municipio': strUpper(c['Municipio ó Alcaldía']),
    'final_estado': strUpper(c['Estado']),
    'final_telefono': strVal(c['Número Celular']),
    'final_colonia': strUpper(c['Colonia acreditado']),
    'final_codigo_postal': strVal(c['Código Postal']),
    'nom_vendedor': "LUIS FERNANDO MARTINEZ TREJO"
  };
};

// Utils
function strUpper(val) {
  return val ? String(val).toUpperCase().trim() : '';
}

function strLower(val) {
  return val ? String(val).toLowerCase().trim() : '';
}

function strVal(val) {
  return val ? String(val).trim() : '';
}
