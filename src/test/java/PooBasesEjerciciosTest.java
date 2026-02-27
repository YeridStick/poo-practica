import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;

public class PooBasesEjerciciosTest {

    private final PooBasesEjercicios bases = new PooBasesEjercicios();

    @Test
    void saludoCorrecto() {
        assertEquals("Hola, soy Ana", bases.crearSaludoPersona("Ana"));
    }

    @Test
    void areaRectanguloCorrecta() {
        assertEquals(10.0, bases.calcularAreaRectangulo(5, 2), 0.001);
    }

    @Test
    void mayorDeEdadValido() {
        assertTrue(bases.esMayorDeEdad(18));
        assertFalse(bases.esMayorDeEdad(17));
    }

    @Test
    void totalCompraCorrecto() {
        assertEquals(10.5, bases.totalCompraSimple(3.5, 3), 0.001);
    }
}
