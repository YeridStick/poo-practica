import static org.junit.jupiter.api.Assumptions.assumeTrue;

import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;

@TestMethodOrder(OrderAnnotation.class)
public class RutaAprendizajeTest {

    private final EjerciciosPracticos ejercicios = new EjerciciosPracticos();

    private boolean paso1Resuelto() {
        return "local".equals(ejercicios.clasificarVariable("x en metodo"))
                && "static".equals(ejercicios.clasificarVariable("contador static"))
                && "instancia".equals(ejercicios.clasificarVariable("nombre en clase"));
    }

    private boolean paso2Resuelto() {
        return Math.abs(90.0 - ejercicios.aplicarDescuento("PORCENTAJE_10", 100.0)) < 0.001
                && Math.abs(35.0 - ejercicios.aplicarDescuento("MONTO_FIJO_15", 50.0)) < 0.001
                && Math.abs(0.0 - ejercicios.aplicarDescuento("MONTO_FIJO_15", 10.0)) < 0.001;
    }

    @Test
    @Order(1)
    void paso1Scope() {
        new Ejercicio01ScopeTest().debeClasificarVariableLocal();
        new Ejercicio01ScopeTest().debeClasificarVariableStatic();
        new Ejercicio01ScopeTest().debeClasificarVariableInstancia();
    }

    @Test
    @Order(2)
    void paso2Strategy() {
        assumeTrue(paso1Resuelto(), "Resuelve primero el paso 1 (Scope).");
        new Ejercicio02StrategyTest().aplicaDescuentoPorcentaje();
        new Ejercicio02StrategyTest().aplicaDescuentoMontoFijo();
        new Ejercicio02StrategyTest().nuncaDevuelveNegativo();
    }

    @Test
    @Order(3)
    void paso3Factory() {
        assumeTrue(paso1Resuelto(), "Resuelve primero el paso 1 (Scope).");
        assumeTrue(paso2Resuelto(), "Resuelve primero el paso 2 (Strategy).");
        new Ejercicio03FactoryTest().mapeaEmail();
        new Ejercicio03FactoryTest().mapeaSms();
        new Ejercicio03FactoryTest().mapeaPush();
        new Ejercicio03FactoryTest().mapeaDesconocido();
    }
}
