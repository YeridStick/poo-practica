import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class Ejercicio03FactoryTest {

    private final EjerciciosPracticos ejercicios = new EjerciciosPracticos();

    @Test
    void mapeaEmail() {
        assertEquals("SMTP", ejercicios.proveedorPorTipo("email"));
    }

    @Test
    void mapeaSms() {
        assertEquals("Twilio", ejercicios.proveedorPorTipo("sms"));
    }

    @Test
    void mapeaPush() {
        assertEquals("Firebase", ejercicios.proveedorPorTipo("push"));
    }

    @Test
    void mapeaDesconocido() {
        assertEquals("DESCONOCIDO", ejercicios.proveedorPorTipo("telegram"));
    }
}
