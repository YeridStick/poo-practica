import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class Ejercicio02StrategyTest {

    private final EjerciciosPracticos ejercicios = new EjerciciosPracticos();

    @Test
    void aplicaDescuentoPorcentaje() {
        assertEquals(90.0, ejercicios.aplicarDescuento("PORCENTAJE_10", 100.0), 0.001);
    }

    @Test
    void aplicaDescuentoMontoFijo() {
        assertEquals(35.0, ejercicios.aplicarDescuento("MONTO_FIJO_15", 50.0), 0.001);
    }

    @Test
    void nuncaDevuelveNegativo() {
        assertEquals(0.0, ejercicios.aplicarDescuento("MONTO_FIJO_15", 10.0), 0.001);
    }
}
