import java.util.ArrayList;
import java.util.List;

public class PatronesDisenoPractica {

    interface MetodoPago {
        double pagar(double monto);
    }

    static class PagoTarjeta implements MetodoPago {
        @Override
        public double pagar(double monto) {
            return monto * 1.03;
        }
    }

    static class PagoTransferencia implements MetodoPago {
        @Override
        public double pagar(double monto) {
            return monto * 0.99;
        }
    }

    static class Checkout {
        private final MetodoPago metodoPago;

        public Checkout(MetodoPago metodoPago) {
            this.metodoPago = metodoPago;
        }

        public void confirmar(double montoBase) {
            double total = metodoPago.pagar(montoBase);
            System.out.println("Total confirmado: " + total);
        }
    }

    interface ObservadorStock {
        void actualizar(String sku, int stock);
    }

    static class AlertaStockBajo implements ObservadorStock {
        @Override
        public void actualizar(String sku, int stock) {
            if (stock <= 2) {
                System.out.println("ALERTA: stock bajo para " + sku + " -> " + stock);
            }
        }
    }

    static class Inventario {
        private final List<ObservadorStock> observadores = new ArrayList<>();

        public void registrar(ObservadorStock obs) {
            observadores.add(obs);
        }

        public void actualizarStock(String sku, int stock) {
            for (ObservadorStock obs : observadores) {
                obs.actualizar(sku, stock);
            }
        }
    }

    public void demoStrategyPago() {
        Checkout conTarjeta = new Checkout(new PagoTarjeta());
        conTarjeta.confirmar(100);

        Checkout conTransferencia = new Checkout(new PagoTransferencia());
        conTransferencia.confirmar(100);
    }

    public void demoObserverStock() {
        Inventario inventario = new Inventario();
        inventario.registrar(new AlertaStockBajo());

        inventario.actualizarStock("SKU-CAFE", 5);
        inventario.actualizarStock("SKU-CAFE", 2);
    }

    // 1. Patron Singleton
    static class Configuracion {
        private static Configuracion instancia;
        private final String env;

        private Configuracion() {
            this.env = "PROD";
        }

        public static Configuracion getInstancia() {
            if (instancia == null) {
                instancia = new Configuracion();
            }
            return instancia;
        }

        public String getEnv() { return env; }
    }

    // 2. Patron Decorator (Envolviendo comportamiento)
    interface Notificacion {
        void enviar(String m);
    }

    static class NotificacionBasica implements Notificacion {
        public void enviar(String m) { System.out.println("Notificacion: " + m); }
    }

    abstract static class NotificacionDecorator implements Notificacion {
        protected Notificacion decorado;
        public NotificacionDecorator(Notificacion n) { this.decorado = n; }
        public void enviar(String m) { decorado.enviar(m); }
    }

    static class UrgenteDecorator extends NotificacionDecorator {
        public UrgenteDecorator(Notificacion n) { super(n); }
        @Override
        public void enviar(String m) {
            System.out.print("[URGENTE] ");
            super.enviar(m);
        }
    }

    public void demoPatronesAvanzados() {
        System.out.println("Singleton Env: " + Configuracion.getInstancia().getEnv());
        
        Notificacion n = new UrgenteDecorator(new NotificacionBasica());
        n.enviar("Servidor caido");
    }

    public void ejerciciosPatrones() {
        System.out.println("1) Crea MetodoPago Efectivo con 5% descuento.");
        System.out.println("2) Crea ObservadorEmail para avisar stock bajo.");
        System.out.println("3) Implementa un Decorator que agregue un log de auditoria a la notificacion.");
    }
}
