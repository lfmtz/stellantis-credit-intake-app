export const conyugeFormFlow = {
  phases: [
    {
      id: 0,
      title: "Bienvenida",
      description: "Registro de cónyuge / coacreditado para mancomunar ingresos en la solicitud de crédito.",
      fields: []
    },
    {
      id: 1,
      title: "Datos Personales",
      description: "Información personal y de vinculación con el solicitante titular.",
      fields: [
        "rfcAcreditado",
        "nombreConyuge",
        "apellidoPaternoConyuge",
        "apellidoMaternoConyuge",
        "fechaNacimientoConyuge",
        "nacionalidadConyuge",
        "rfcConyuge",
        "entidadFederativaNacimientoConyuge",
        "curpConyuge"
      ]
    },
    {
      id: 2,
      title: "Información Laboral e Ingresos",
      description: "Datos de empleo, domicilio laboral e ingresos netos comprobables.",
      fields: [
        "ocupacionConyuge",
        "nombreEmpresaConyuge",
        "giroEmpresaConyuge",
        "telefonoEmpresaConyuge",
        "calleEmpresaConyuge",
        "numExtIntEmpresaConyuge",
        "coloniaEmpresaConyuge",
        "alcaldiaEmpresaConyuge",
        "cpEmpresaConyuge",
        "ciudadPoblacionEmpresaConyuge",
        "estadoEmpresaConyuge",
        "ingresosConyuge",
        "antiguedadEmpresaConyuge"
      ]
    },
    {
      id: 3,
      title: "Revisión Final",
      description: "Verifica que todos tus datos sean correctos antes de realizar el envío.",
      fields: []
    }
  ]
};
