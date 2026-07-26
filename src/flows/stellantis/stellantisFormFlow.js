export const stellantisFormFlow = {
  phases: [
    {
      id: 0,
      title: "Bienvenida",
      description: "Comienza tu solicitud de crédito Stellantis de manera rápida y guiada.",
      fields: []
    },
    {
      id: 1,
      title: "Datos Personales",
      description: "Cuéntanos sobre ti para iniciar el proceso.",
      fields: [
        "nombreAcreditado",
        "apellidoPaternoAcreditado",
        "apellidoMaternoAcreditado",
        "rfc",
        "curp",
        "paisNacimiento",
        "entidadFederativaNacimiento",
        "fechaNacimiento",
        "numeroCelular",
        "companiaTelefonica",
        "correoElectronico"
      ]
    },
    {
      id: 2,
      title: "Domicilio Particular",
      description: "Por favor, ingresa los datos de tu dirección de residencia actual.",
      fields: [
        "calle",
        "numeroExterior",
        "numeroInterior",
        "coloniaAcreditado",
        "codigoPostal",
        "municipioAlcaldia",
        "estado",
        "ciudadPoblacion",
        "telefonoCasaFijo",
        "anosVivirDomicilio"
      ]
    },
    {
      id: 3,
      title: "Información Laboral",
      description: "Detalles sobre tu ocupación e ingresos.",
      fields: [
        "puestoActividad",
        "nombreEmpresa",
        "giroEmpresa",
        "calleTrabajo",
        "numeroExteriorTrabajo",
        "coloniaTrabajo",
        "municipioAlcaldiaTrabajo",
        "estadoTrabajo",
        "codigoPostalTrabajo",
        "telefonoOficinaExt",
        "nombreJefeInmediato",
        "antiguedadEmpleoAnos"
      ]
    },
    {
      id: 4,
      title: "Referencias Personales",
      description: "Por favor, ingresa los datos de tres personas que te conozcan.",
      fields: [
        // Referencia 1
        "ref1Nombre",
        "ref1Parentesco",
        "ref1Telefono",
        "ref1Ocupacion",
        // Referencia 2
        "ref2Nombre",
        "ref2Parentesco",
        "ref2Telefono",
        "ref2Ocupacion",
        // Referencia 3
        "ref3Nombre",
        "ref3Parentesco",
        "ref3Telefono",
        "ref3Ocupacion"
      ]
    },
    {
      id: 5,
      title: "Revisión Final",
      description: "Verifica que todos tus datos sean correctos antes de realizar el envío.",
      fields: []
    }
  ]
};
