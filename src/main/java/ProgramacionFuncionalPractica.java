import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class ProgramacionFuncionalPractica {

    public List<Integer> filtrarPares(List<Integer> numeros) {
        return numeros.stream()
                .filter(n -> n % 2 == 0)
                .collect(Collectors.toList());
    }

    public List<String> convertirAMayusculas(List<String> textos) {
        return textos.stream()
                .map(String::toUpperCase)
                .collect(Collectors.toList());
    }

    public int sumaTotal(List<Integer> numeros) {
        return numeros.stream().reduce(0, Integer::sum);
    }

    public Map<Integer, List<String>> agruparPorLongitud(List<String> palabras) {
        return palabras.stream()
                .collect(Collectors.groupingBy(String::length));
    }

    public void demoFuncional() {
        List<Integer> nums = Arrays.asList(1, 2, 3, 4, 5, 6);
        List<String> palabras = Arrays.asList("java", "poo", "stream", "map");

        System.out.println("Pares: " + filtrarPares(nums));
        System.out.println("Mayusculas: " + convertirAMayusculas(palabras));
        System.out.println("Suma total: " + sumaTotal(nums));
        System.out.println("Agrupadas: " + agruparPorLongitud(palabras));
    }

    public void ejerciciosFuncionales() {
        System.out.println("1) Filtra mayores a 10 con stream().filter.");
        System.out.println("2) Ordena productos por precio con sorted().");
        System.out.println("3) Calcula promedio con mapToInt().average().");
        System.out.println("4) Agrupa por categoria con groupingBy().");
    }
}
