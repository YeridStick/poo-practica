public class PooBasesEjercicios {

    public String crearSaludoPersona(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("Nombre invalido");
        }
        return "Hola, soy " + nombre;
    }

    public double calcularAreaRectangulo(double base, double altura) {
        if (base <= 0 || altura <= 0) {
            throw new IllegalArgumentException("Base y altura deben ser positivas");
        }
        return base * altura;
    }

    public boolean esMayorDeEdad(int edad) {
        return edad >= 18;
    }

    public double totalCompraSimple(double precio, int cantidad) {
        if (precio < 0 || cantidad < 0) {
            throw new IllegalArgumentException("Datos invalidos");
        }
        return precio * cantidad;
    }

    public void demoBases() {
        System.out.println(crearSaludoPersona("Ana"));
        System.out.println("Area: " + calcularAreaRectangulo(5, 2));
        System.out.println("Mayor de edad (20): " + esMayorDeEdad(20));
        System.out.println("Total compra: " + totalCompraSimple(3.5, 3));
    }

    public void ejerciciosBase() {
        System.out.println("1) Crear clase Mascota con nombre/edad y metodo presentarse().");
        System.out.println("2) Crear clase Cuenta con saldo y metodo depositar/retirar.");
        System.out.println("3) Agregar validaciones en constructores.");
        System.out.println("4) Probar en consola con varios casos.");
    }
}
