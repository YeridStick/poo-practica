public class ScopeInstanciasPractica {

    // Campo de instancia: cada objeto tiene su propia copia.
    private String nombre;

    // Campo de clase (static): se comparte entre todos los objetos.
    private static int totalInstancias = 0;

    public ScopeInstanciasPractica(String nombre) {
        this.nombre = nombre;
        totalInstancias++;
    }

    public String getNombre() {
        return nombre;
    }

    public static int getTotalInstancias() {
        return totalInstancias;
    }

    public void cambiarNombre(String nuevoNombre) {
        // Scope local: solo vive dentro de este metodo.
        String anterior = this.nombre;
        this.nombre = nuevoNombre;
        System.out.println("Cambio de nombre: " + anterior + " -> " + this.nombre);
    }

    public void ejercicioScopeBloques(int edad) {
        if (edad >= 18) {
            // Scope de bloque: solo existe dentro del if.
            String categoria = "ADULTO";
            System.out.println("Categoria: " + categoria);
        }

        // Ejercicio: descomenta la siguiente linea y explica por que no compila.
        // System.out.println(categoria);
    }

    public static void ejercicioStaticVsInstancia() {
        ScopeInstanciasPractica a = new ScopeInstanciasPractica("Ana");
        ScopeInstanciasPractica b = new ScopeInstanciasPractica("Luis");

        System.out.println("a.nombre = " + a.getNombre());
        System.out.println("b.nombre = " + b.getNombre());
        System.out.println("totalInstancias = " + ScopeInstanciasPractica.getTotalInstancias());

        a.cambiarNombre("Ana Maria");
        System.out.println("a.nombre (nuevo) = " + a.getNombre());
        System.out.println("b.nombre (sin cambios) = " + b.getNombre());
    }

    public static void ejercicioShadowing() {
        int valor = 10;
        System.out.println("Valor externo: " + valor);

        {
            int valorInterno = 20;
            System.out.println("Valor interno: " + valorInterno);
        }

        // Ejercicio: intenta declarar otra vez 'int valor = 99;' en este mismo scope.
        // Debe fallar por variable duplicada en el mismo alcance.
    }
}
