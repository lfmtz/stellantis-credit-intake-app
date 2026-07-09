export const stellantisFieldSchema = {
  // FASE 1: DATOS PERSONALES
  nombreAcreditado: {
    label: "Nombre(s)",
    prompt: "¡Hola! Vamos a comenzar con tu solicitud. Para registrar tus datos de manera ordenada, por favor ingresa primero tu nombre o nombres (más adelante te pediré tus apellidos). ¿Cuál es tu nombre o nombres?",
    type: "text",
    placeholder: "Ingresa tu(s) nombre(s)",
    phase: 1,
    sheetHeader: "Nombre(s) acreditado",
    validation: {
      required: true,
      minLength: 2,
      message: "Por favor, ingresa tu nombre (mínimo 2 letras)."
    }
  },
  apellidoPaternoAcreditado: {
    label: "Apellido Paterno",
    prompt: "Excelente. Ahora dime, ¿cuál es tu apellido paterno?",
    type: "text",
    placeholder: "Ingresa tu apellido paterno",
    phase: 1,
    sheetHeader: "Apellido Paterno acreditado",
    validation: {
      required: true,
      minLength: 2,
      message: "Tu apellido paterno es requerido para la solicitud."
    }
  },
  apellidoMaternoAcreditado: {
    label: "Apellido Materno",
    prompt: "¿Y cuál es tu apellido materno?",
    type: "text",
    placeholder: "Ingresa tu apellido materno",
    phase: 1,
    sheetHeader: "Apellido Materno acreditado",
    validation: {
      required: true,
      minLength: 2,
      message: "Tu apellido materno es obligatorio para el expediente."
    }
  },
  rfc: {
    label: "RFC",
    prompt: "¿Cuál es tu RFC con homoclave?",
    type: "text",
    placeholder: "ABCD123456XYZ",
    phase: 1,
    sheetHeader: "RFC",
    validation: {
      required: true,
      pattern: /^[A-Z&Ññ]{4}[0-9]{6}[A-Z0-9]{3}$/i,
      message: "Ese RFC no parece válido. Recuerda el formato: 4 letras, 6 números y 3 dígitos de homoclave."
    }
  },
  curp: {
    label: "CURP",
    prompt: "Ahora compárteme tu CURP a 18 dígitos.",
    type: "text",
    placeholder: "ABCD123456HXYZW12",
    phase: 1,
    sheetHeader: "CURP",
    validation: {
      required: true,
      pattern: /^[A-Z]{4}[0-9]{6}[H,M][A-Z]{5}[A-Z0-9]{2}$/i,
      message: "Esa CURP no es válida. Debe tener exactamente 18 caracteres alfanuméricos."
    }
  },
  paisNacimiento: {
    label: "País de Nacimiento",
    prompt: "¿En qué país naciste?",
    type: "text",
    placeholder: "Ej. México",
    phase: 1,
    sheetHeader: "País de Nacimiento",
    validation: {
      required: true,
      message: "El país de nacimiento es obligatorio."
    }
  },
  entidadFederativaNacimiento: {
    label: "Entidad Federativa",
    prompt: "¿En qué estado o entidad federativa naciste?",
    type: "text",
    placeholder: "Ej. Ciudad de México",
    phase: 1,
    sheetHeader: "Entidad Federativa de nacimiento",
    validation: {
      required: true,
      message: "La entidad federativa de nacimiento es requerida."
    }
  },
  fechaNacimiento: {
    label: "Fecha de Nacimiento",
    prompt: "¿Cuál es tu fecha de nacimiento?",
    type: "date",
    placeholder: "",
    phase: 1,
    sheetHeader: "Fecha de Nacimiento",
    validation: {
      required: true,
      message: "Necesito tu fecha de nacimiento para continuar."
    }
  },
  numeroCelular: {
    label: "Número Celular",
    prompt: "¿A qué número celular te podemos contactar? (10 dígitos)",
    type: "tel",
    placeholder: "5512345678",
    phase: 1,
    sheetHeader: "Número Celular",
    validation: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "El celular debe contener exactamente 10 dígitos numéricos."
    }
  },
  companiaTelefonica: {
    label: "Compañía telefónica",
    prompt: "¿Cuál es tu compañía telefónica celular?",
    type: "select",
    placeholder: "Selecciona una compañía",
    options: ["Telcel", "Movistar", "AT&T", "Altan", "Otra"],
    phase: 1,
    sheetHeader: "Compañia telefonica",
    validation: {
      required: true,
      message: "Selecciona una opción de la lista."
    }
  },
  correoElectronico: {
    label: "Correo Electrónico",
    prompt: "Por último para esta fase, ¿cuál es tu correo electrónico personal?",
    type: "email",
    placeholder: "ejemplo@correo.com",
    phase: 1,
    sheetHeader: "Correo Electrónico",
    validation: {
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Necesito un correo electrónico válido (ejemplo@dominio.com)."
    }
  },

  // FASE 2: DOMICILIO PARTICULAR
  calle: {
    label: "Calle",
    prompt: "Comencemos con tu domicilio particular. ¿Cuál es el nombre de tu calle?",
    type: "text",
    placeholder: "Ej. Insurgentes",
    phase: 2,
    sheetHeader: "Calle (solo nombre)",
    validation: {
      required: true,
      message: "El nombre de la calle es obligatorio."
    }
  },
  numeroExterior: {
    label: "Número exterior",
    prompt: "¿Cuál es tu número exterior?",
    type: "text",
    placeholder: "Ej. 300 o S/N",
    phase: 2,
    sheetHeader: "Numero exterior",
    validation: {
      required: true,
      message: "El número exterior es requerido."
    }
  },
  numeroInterior: {
    label: "Número interior",
    prompt: "¿Tienes número interior? (De lo contrario puedes dejarlo en blanco o escribir N/A)",
    type: "text",
    placeholder: "Ej. Depto 402 (Opcional)",
    phase: 2,
    sheetHeader: "Numero interior",
    validation: {
      required: false
    }
  },
  coloniaAcreditado: {
    label: "Colonia",
    prompt: "¿En qué colonia se ubica tu domicilio?",
    type: "text",
    placeholder: "Ej. Roma Norte",
    phase: 2,
    sheetHeader: "Colonia acreditado",
    validation: {
      required: true,
      message: "La colonia es requerida para ubicar tu domicilio."
    }
  },
  codigoPostal: {
    label: "Código Postal",
    prompt: "¿Cuál es tu código postal?",
    type: "text",
    placeholder: "Ej. 06700",
    phase: 2,
    sheetHeader: "Código Postal",
    validation: {
      required: true,
      pattern: /^[0-9]{5}$/,
      message: "El código postal debe ser un número de 5 dígitos."
    }
  },
  municipioAlcaldia: {
    label: "Municipio o Alcaldía",
    prompt: "¿A qué municipio o alcaldía pertenece tu domicilio?",
    type: "text",
    placeholder: "Ej. Cuauhtémoc",
    phase: 2,
    sheetHeader: "Municipio ó Alcaldía",
    validation: {
      required: true,
      message: "Este campo es obligatorio."
    }
  },
  estado: {
    label: "Estado",
    prompt: "¿En qué estado se encuentra tu domicilio?",
    type: "text",
    placeholder: "Ej. Ciudad de México",
    phase: 2,
    sheetHeader: "Estado",
    validation: {
      required: true,
      message: "El estado es obligatorio."
    }
  },
  ciudadPoblacion: {
    label: "Ciudad o Población",
    prompt: "¿Cuál es tu ciudad, población o localidad? (Por favor, escribe de nuevo la ciudad correspondiente al estado que seleccionaste)",
    type: "text",
    placeholder: "Ej. Monterrey",
    phase: 2,
    sheetHeader: "Ciudad o Población",
    validation: {
      required: true,
      message: "La ciudad o población es obligatoria."
    }
  },
  telefonoCasaFijo: {
    label: "Teléfono Fijo de Casa",
    prompt: "¿Cuál es tu número de teléfono de casa (fijo o celular de respaldo)?",
    type: "tel",
    placeholder: "Ej. 5555432100",
    phase: 2,
    sheetHeader: "Teléfono de casa fijo o celular",
    validation: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "Por favor introduce un número telefónico válido a 10 dígitos."
    }
  },
  anosVivirDomicilio: {
    label: "Años de Residencia",
    prompt: "¿Cuántos años llevas viviendo en tu domicilio actual?",
    type: "number",
    placeholder: "Ej. 3",
    phase: 2,
    sheetHeader: "Años de vivir en su domicilio",
    validation: {
      required: true,
      min: 0,
      message: "Por favor, ingresa los años en tu domicilio."
    }
  },

  // FASE 3: INFORMACIÓN LABORAL
  puestoActividad: {
    label: "Puesto o Actividad",
    prompt: "Entendido. Pasemos a la información laboral. ¿Qué puesto o actividad desempeñas en tu trabajo?",
    type: "text",
    placeholder: "Ej. Analista de Sistemas / Comerciante",
    phase: 3,
    sheetHeader: "¿Qué puesto o actividad desempeñas en tu trabajo?",
    validation: {
      required: true,
      message: "El puesto o actividad es obligatorio."
    }
  },
  nombreEmpresa: {
    label: "Nombre de la Empresa",
    prompt: "¿Cuál es el nombre de la empresa o institución donde laboras?",
    type: "text",
    placeholder: "Ej. Inbursa S.A.",
    phase: 3,
    sheetHeader: "Nombre de la Empresa ó Institución",
    validation: {
      required: true,
      message: "El nombre de la empresa es requerido."
    }
  },
  giroEmpresa: {
    label: "Giro de la Empresa",
    prompt: "¿A qué se dedica la empresa donde laboras?",
    type: "text",
    placeholder: "Ej. Financiero / Automotriz",
    phase: 3,
    sheetHeader: "¿A que se dedica la empresa donde laboras?",
    validation: {
      required: true,
      message: "El giro de la empresa es obligatorio."
    }
  },
  calleTrabajo: {
    label: "Calle de Trabajo",
    prompt: "¿Cuál es el nombre de la calle donde está tu trabajo?",
    type: "text",
    placeholder: "Ej. Paseo de las Palmas",
    phase: 3,
    sheetHeader: "Calle trabajo (solo el nombre)",
    validation: {
      required: true,
      message: "La calle de trabajo es requerida."
    }
  },
  numeroExteriorTrabajo: {
    label: "Número Exterior Trabajo",
    prompt: "¿Cuál es el número exterior de tu trabajo?",
    type: "text",
    placeholder: "Ej. 750",
    phase: 3,
    sheetHeader: "Numero exterior trabajo",
    validation: {
      required: true,
      message: "El número exterior es obligatorio."
    }
  },
  coloniaTrabajo: {
    label: "Colonia Trabajo",
    prompt: "¿En qué colonia está tu trabajo?",
    type: "text",
    placeholder: "Ej. Lomas de Chapultepec",
    phase: 3,
    sheetHeader: "Colonia trabajo",
    validation: {
      required: true,
      message: "La colonia es obligatoria."
    }
  },
  municipioAlcaldiaTrabajo: {
    label: "Municipio/Alcaldía Trabajo",
    prompt: "¿A qué municipio o alcaldía pertenece tu trabajo?",
    type: "text",
    placeholder: "Ej. Miguel Hidalgo",
    phase: 3,
    sheetHeader: "Municipio ó Alcaldía trabajo",
    validation: {
      required: true,
      message: "Este campo es requerido."
    }
  },
  estadoTrabajo: {
    label: "Estado Trabajo",
    prompt: "¿En qué estado se encuentra tu trabajo?",
    type: "text",
    placeholder: "Ej. Ciudad de México",
    phase: 3,
    sheetHeader: "Estado trabajo",
    validation: {
      required: true,
      message: "El estado de trabajo es obligatorio."
    }
  },
  codigoPostalTrabajo: {
    label: "Código Postal Trabajo",
    prompt: "¿Cuál es el código postal de tu trabajo?",
    type: "text",
    placeholder: "Ej. 11000",
    phase: 3,
    sheetHeader: "Código Postal trabajo",
    validation: {
      required: true,
      pattern: /^[0-9]{5}$/,
      message: "El código postal debe ser un número de 5 dígitos."
    }
  },
  telefonoOficinaExt: {
    label: "Teléfono Trabajo",
    prompt: "¿Cuál es tu teléfono de oficina y extensión o número directo?",
    type: "text",
    placeholder: "Ej. 5554321099 Ext 123",
    phase: 3,
    sheetHeader: "Teléfono de oficina y extensión ó directo",
    validation: {
      required: true,
      message: "El teléfono de trabajo es obligatorio."
    }
  },
  nombreJefeInmediato: {
    label: "Nombre del Jefe",
    prompt: "¿Cuál es el nombre completo de tu jefe inmediato?",
    type: "text",
    placeholder: "Ej. Juan Gómez",
    phase: 3,
    sheetHeader: "Nombre de tu Jefe Inmediato",
    validation: {
      required: true,
      message: "El nombre del jefe inmediato es obligatorio."
    }
  },
  antiguedadEmpleoAnos: {
    label: "Antigüedad Laboral",
    prompt: "¿Cuál es tu antigüedad en años en este empleo o negocio?",
    type: "number",
    placeholder: "Ej. 4",
    phase: 3,
    sheetHeader: "Antigüedad en el empleo, negocio ó jubilado ó pensionado años",
    validation: {
      required: true,
      min: 0,
      message: "La antigüedad laboral en años es requerida."
    }
  },

  // FASE 4: REFERENCIAS PERSONALES
  // Referencia 1
  ref1Nombre: {
    label: "Nombre Ref 1",
    prompt: "Ya casi terminamos. Ahora capturemos tus tres referencias personales. Por favor, asegúrate de que sean dos familiares y una amistad. ¿Cuál es el nombre (solo nombre o nombres) de tu Referencia 1?",
    type: "text",
    placeholder: "Ej. Laura",
    phase: 4,
    sheetHeader: "Nombre (solo nombre) referencia 1",
    validation: {
      required: true,
      message: "El nombre es obligatorio."
    }
  },
  ref1ApellidoPaterno: {
    label: "Apellidos Ref 1",
    prompt: "¿Cuál es su apellido paterno y materno?",
    type: "text",
    placeholder: "Ej. Rodríguez Gómez",
    phase: 4,
    sheetHeader: "Apellido Paterno (solo nombre) referencia 1",
    validation: {
      required: true,
      minLength: 2,
      message: "Los apellidos de tu referencia son requeridos."
    }
  },
  ref1Parentesco: {
    label: "Parentesco Ref 1",
    prompt: "¿Qué parentesco tiene la Referencia 1 contigo?",
    type: "text",
    placeholder: "Ej. Hermana / Primo / Amigo",
    phase: 4,
    sheetHeader: "Parentesco ref 1",
    validation: {
      required: true,
      message: "El parentesco es requerido."
    }
  },
  ref1Telefono: {
    label: "Teléfono Ref 1",
    prompt: "¿Cuál es su número celular o fijo a 10 dígitos?",
    type: "tel",
    placeholder: "Ej. 5599887766",
    phase: 4,
    sheetHeader: "Teléfono de la Referencia 1",
    validation: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "El teléfono debe ser un número de 10 dígitos."
    }
  },
  ref1Ocupacion: {
    label: "Ocupación Ref 1",
    prompt: "¿A qué se dedica o qué ocupación tiene?",
    type: "text",
    placeholder: "Ej. Diseñadora / Profesor",
    phase: 4,
    sheetHeader: "Ocupacion de la referencia 1",
    validation: {
      required: true,
      message: "La ocupación es obligatoria."
    }
  },

  // Referencia 2
  ref2Nombre: {
    label: "Nombre Ref 2",
    prompt: "Perfecto. Vamos con tu Referencia 2. ¿Cuál es su nombre o nombres?",
    type: "text",
    placeholder: "Ej. Oscar",
    phase: 4,
    sheetHeader: "Nombre (solo nombre) referencia 2",
    validation: {
      required: true,
      message: "El nombre es obligatorio."
    }
  },
  ref2ApellidoPaterno: {
    label: "Apellidos Ref 2",
    prompt: "¿Cuál es su apellido paterno y materno?",
    type: "text",
    placeholder: "Ej. Hernández Pérez",
    phase: 4,
    sheetHeader: "Apellido Paterno (solo nombre) referencia 2",
    validation: {
      required: true,
      minLength: 2,
      message: "Los apellidos de tu referencia son requeridos."
    }
  },
  ref2Parentesco: {
    label: "Parentesco Ref 2",
    prompt: "¿Qué parentesco tiene la Referencia 2 contigo?",
    type: "text",
    placeholder: "Ej. Tío / Amigo / Compañero",
    phase: 4,
    sheetHeader: "Parentesco ref 2",
    validation: {
      required: true,
      message: "El parentesco es requerido."
    }
  },
  ref2Telefono: {
    label: "Teléfono Ref 2",
    prompt: "¿Cuál es su número de teléfono a 10 dígitos?",
    type: "tel",
    placeholder: "Ej. 5566778899",
    phase: 4,
    sheetHeader: "Teléfono de la Referencia 2",
    validation: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "El teléfono debe ser un número de 10 dígitos."
    }
  },
  ref2Ocupacion: {
    label: "Ocupación Ref 2",
    prompt: "¿Qué ocupación desempeña tu Referencia 2?",
    type: "text",
    placeholder: "Ej. Arquitecto / Empleado",
    phase: 4,
    sheetHeader: "Ocupacion de la referencia 2",
    validation: {
      required: true,
      message: "La ocupación es requerida."
    }
  },

  // Referencia 3
  ref3Nombre: {
    label: "Nombre Ref 3",
    prompt: "Excelente. Finalmente, capturemos tu Referencia 3. ¿Cuál es su nombre o nombres?",
    type: "text",
    placeholder: "Ej. Sofía",
    phase: 4,
    sheetHeader: "Nombre (solo nombre) referencia 3",
    validation: {
      required: true,
      message: "El nombre es obligatorio."
    }
  },
  ref3ApellidoPaterno: {
    label: "Apellidos Ref 3",
    prompt: "¿Cuál es su apellido paterno y materno?",
    type: "text",
    placeholder: "Ej. Martínez López",
    phase: 4,
    sheetHeader: "Apellido Paterno (solo nombre) referencia 3",
    validation: {
      required: true,
      minLength: 2,
      message: "Los apellidos de tu referencia son requeridos."
    }
  },
  ref3Parentesco: {
    label: "Parentesco Ref 3",
    prompt: "¿Qué parentesco tiene la Referencia 3 contigo?",
    type: "text",
    placeholder: "Ej. Vecino / Hermana / Amigo",
    phase: 4,
    sheetHeader: "Parentesco ref 3",
    validation: {
      required: true,
      message: "El parentesco es requerido."
    }
  },
  ref3Telefono: {
    label: "Teléfono Ref 3",
    prompt: "¿Cuál es su teléfono a 10 dígitos?",
    type: "tel",
    placeholder: "Ej. 5511223344",
    phase: 4,
    sheetHeader: "Teléfono de la Referencia 3",
    validation: {
      required: true,
      pattern: /^[0-9]{10}$/,
      message: "El teléfono debe ser un número de 10 dígitos."
    }
  },
  ref3Ocupacion: {
    label: "Ocupación Ref 3",
    prompt: "¿Cuál es su ocupación?",
    type: "text",
    placeholder: "Ej. Médica / Comerciante",
    phase: 4,
    sheetHeader: "Ocupacion de la referencia 3",
    validation: {
      required: true,
      message: "La ocupación es obligatoria."
    }
  }
};
