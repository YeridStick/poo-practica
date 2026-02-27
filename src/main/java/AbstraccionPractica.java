public class AbstraccionPractica {

    // Contrato comun para todas las estrategias de notificacion.
    interface Notificador {
        void enviar(String destino, String mensaje);
    }

    // Base compartida: reutiliza validaciones y estado comun (proveedor).
    abstract static class NotificadorBase implements Notificador {
        protected String proveedor;

        protected NotificadorBase(String proveedor) {
            this.proveedor = proveedor;
        }

        // Validaciones para evitar repetir codigo en cada implementacion.
        protected void validar(String destino, String mensaje) {
            if (destino == null || destino.isBlank()) {
                throw new IllegalArgumentException("Destino invalido");
            }
            if (mensaje == null || mensaje.isBlank()) {
                throw new IllegalArgumentException("Mensaje invalido");
            }
        }
    }

    static class NotificadorEmail extends NotificadorBase {
        public NotificadorEmail() {
            super("SMTP");
        }

        // Estrategia concreta 1: envio por email.
        @Override
        public void enviar(String destino, String mensaje) {
            validar(destino, mensaje);
            System.out.println("Email enviado por " + proveedor + " a " + destino + ": " + mensaje);
        }
    }

    static class NotificadorSms extends NotificadorBase {
        public NotificadorSms() {
            super("Twilio");
        }

        // Estrategia concreta 2: envio por SMS.
        @Override
        public void enviar(String destino, String mensaje) {
            validar(destino, mensaje);
            System.out.println("SMS enviado por " + proveedor + " a " + destino + ": " + mensaje);
        }
    }

    static class NotificadorPush extends NotificadorBase {
        public NotificadorPush() {
            super("Firebase");
        }

        // Estrategia concreta 3: envio push.
        @Override
        public void enviar(String destino, String mensaje) {
            validar(destino, mensaje);
            System.out.println("Push enviado por " + proveedor + " al dispositivo " + destino + ": " + mensaje);
        }
    }

    // Fabrica simple para encapsular la creacion de estrategias.
    static class NotificadorFactory {
        public static Notificador crear(String tipo) {
            if (tipo == null) {
                throw new IllegalArgumentException("Tipo no puede ser null");
            }

            switch (tipo.toLowerCase()) {
                case "email":
                    return new NotificadorEmail();
                case "sms":
                    return new NotificadorSms();
                case "push":
                    return new NotificadorPush();
                case "telegram":
                    return new NotificadorTelegram();
                default:
                    throw new IllegalArgumentException("Tipo no soportado: " + tipo);
            }
        }
    }

    static class NotificadorTelegram extends NotificadorBase {
        public NotificadorTelegram() {
            super("TelegramAPI");
        }

        @Override
        public void enviar(String destino, String mensaje) {
            validar(destino, mensaje);
            System.out.println("Telegram enviado a " + destino + ": " + mensaje);
        }
    }

    // Cliente de alto nivel: depende de la abstraccion (Notificador), no de una clase concreta.
    static class ServicioAlerta {
        private final Notificador notificador;

        public ServicioAlerta(Notificador notificador) {
            this.notificador = notificador;
        }

        public void alertar(String destino, String mensaje) {
            notificador.enviar(destino, mensaje);
        }
    }

    // Demo del patron Strategy: cambiamos comportamiento sin cambiar el cliente.
    public void demoNotificaciones() {
        ServicioAlerta servicioEmail = new ServicioAlerta(new NotificadorEmail());
        servicioEmail.alertar("ana@mail.com", "Tu pedido fue enviado");

        ServicioAlerta servicioSms = new ServicioAlerta(new NotificadorSms());
        servicioSms.alertar("+34123456789", "Tu codigo es 1234");

        ServicioAlerta servicioPush = new ServicioAlerta(new NotificadorPush());
        servicioPush.alertar("device-987", "Tienes una nueva promocion");
        
        ServicioAlerta servicioTelegram = new ServicioAlerta(new NotificadorTelegram());
        servicioTelegram.alertar("@usuario123", "Hola desde Java");
    }

    // Demo de Factory Method simple: el tipo llega como dato y la fabrica decide.
    public void demoFactoryNotificador() {
        Notificador notificador = NotificadorFactory.crear("email");
        ServicioAlerta servicio = new ServicioAlerta(notificador);
        servicio.alertar("cliente@correo.com", "Recordatorio de pago");
    }
}
