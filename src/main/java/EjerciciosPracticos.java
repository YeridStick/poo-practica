public class EjerciciosPracticos {

    // Ejercicio 1 (Scope): devuelve el tipo de variable segun el enunciado.
    // Reglas:
    // - "x en metodo" -> "local"
    // - "contador static" -> "static"
    // - "nombre en clase" -> "instancia"
    public String clasificarVariable(String caso) {
        return "";
    }

    // Ejercicio 2 (Strategy): aplica descuento segun estrategia.
    // "PORCENTAJE_10" => total * 0.90
    // "MONTO_FIJO_15" => total - 15
    // Si resultado da negativo, devolver 0.
    public double aplicarDescuento(String estrategia, double total) {
        return -1;
    }

    // Ejercicio 3 (Factory): mapear tipo de notificador a proveedor.
    // "email" -> "SMTP"
    // "sms" -> "Twilio"
    // "push" -> "Firebase"
    // otro -> "DESCONOCIDO"
    public String proveedorPorTipo(String tipo) {
        return "";
    }
}
