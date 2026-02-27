import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;

public class Ejercicio01ScopeTest {

    private final EjerciciosPracticos ejercicios = new EjerciciosPracticos();

    @Test
    void debeClasificarVariableLocal() {
        assertEquals("local", ejercicios.clasificarVariable("x en metodo"));
    }

    @Test
    void debeClasificarVariableStatic() {
        assertEquals("static", ejercicios.clasificarVariable("contador static"));
    }

    @Test
    void debeClasificarVariableInstancia() {
        assertEquals("instancia", ejercicios.clasificarVariable("nombre en clase"));
    }
}
