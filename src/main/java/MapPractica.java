import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

public class MapPractica {

    public void contarFrecuenciasEImprimirUnicos(int[] arr) {
        Map<Integer, Integer> freq = new LinkedHashMap<>();

        for (int x : arr) {
            freq.put(x, freq.getOrDefault(x, 0) + 1);
        }

        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            System.out.println(e.getKey() + " -> " + e.getValue());
        }

        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            if (e.getValue() == 1) {
                System.out.println("Unico: " + e.getKey());
            }
        }

        int[] repeticionesPorPosicion = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            repeticionesPorPosicion[i] = freq.get(arr[i]);
        }
    }

    public void contarFrecuenciasConContainsKey(int[] arr) {
        Map<Integer, Integer> freq = new HashMap<>();

        for (int x : arr) {
            if (freq.containsKey(x)) {
                freq.put(x, freq.get(x) + 1);
            } else {
                freq.put(x, 1);
            }
        }

        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            System.out.println("Numero " + e.getKey() + " aparece " + e.getValue() + " veces");
        }
    }

    public void imprimirNumeroMasFrecuente(int[] arr) {
        Map<Integer, Integer> freq = new LinkedHashMap<>();

        for (int x : arr) {
            freq.put(x, freq.getOrDefault(x, 0) + 1);
        }

        int numeroMasFrecuente = 0;
        int mayorFrecuencia = 0;
        boolean inicializado = false;

        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            if (!inicializado || e.getValue() > mayorFrecuencia) {
                numeroMasFrecuente = e.getKey();
                mayorFrecuencia = e.getValue();
                inicializado = true;
            }
        }

        if (inicializado) {
            System.out.println("Numero mas frecuente: " + numeroMasFrecuente + " (" + mayorFrecuencia + " veces)");
        } else {
            System.out.println("El arreglo esta vacio");
        }
    }

    public void imprimirFrecuenciaPorPosicion(int[] arr) {
        Map<Integer, Integer> freq = new LinkedHashMap<>();

        for (int x : arr) {
            freq.put(x, freq.getOrDefault(x, 0) + 1);
        }

        int[] repeticionesPorPosicion = new int[arr.length];
        for (int i = 0; i < arr.length; i++) {
            repeticionesPorPosicion[i] = freq.get(arr[i]);
            System.out.println("Indice " + i + ": valor " + arr[i] + ", repeticiones " + repeticionesPorPosicion[i]);
        }
    }

    public void contarLetrasSinEspacios(String texto) {
        Map<Character, Integer> freq = new LinkedHashMap<>();

        for (int i = 0; i < texto.length(); i++) {
            char c = texto.charAt(i);
            if (c == ' ') {
                continue;
            }
            freq.put(c, freq.getOrDefault(c, 0) + 1);
        }

        for (Map.Entry<Character, Integer> e : freq.entrySet()) {
            System.out.println("Letra '" + e.getKey() + "' -> " + e.getValue());
        }
    }

    public void compararKeySetEntrySetValues(int[] arr) {
        Map<Integer, Integer> freq = new LinkedHashMap<>();

        for (int x : arr) {
            freq.put(x, freq.getOrDefault(x, 0) + 1);
        }

        System.out.println("Recorrido con keySet:");
        for (Integer key : freq.keySet()) {
            System.out.println(key + " -> " + freq.get(key));
        }

        System.out.println("Recorrido con entrySet:");
        for (Map.Entry<Integer, Integer> e : freq.entrySet()) {
            System.out.println(e.getKey() + " -> " + e.getValue());
        }

        System.out.println("Solo valores con values:");
        for (Integer value : freq.values()) {
            System.out.println(value);
        }
    }

    public void agruparPalabrasPorLongitud(String[] palabras) {
        Map<Integer, List<String>> grupos = new LinkedHashMap<>();

        for (String palabra : palabras) {
            int longitud = palabra.length();
            grupos.putIfAbsent(longitud, new ArrayList<>());
            grupos.get(longitud).add(palabra);
        }

        for (Map.Entry<Integer, List<String>> e : grupos.entrySet()) {
            System.out.println("Longitud " + e.getKey() + " -> " + e.getValue());
        }
    }

    public void contarFrecuenciasBasico(int[] arr) {
        Map<Integer, Integer> cuentas = new HashMap<>();

        for (int num : arr) {
            cuentas.put(num, cuentas.getOrDefault(num, 0) + 1);
        }

        for (Map.Entry<Integer, Integer> entry : cuentas.entrySet()) {
            System.out.println(entry.getKey() + " " + entry.getValue());
        }
    }

    public void ordenarIdsConTreeSetYMap(int[] ids, String[] nombres) {
        int n = ids.length;
        Map<Integer, String> mapa = new HashMap<>();
        Set<Integer> ordenadosSinRepetir = new TreeSet<>();

        for (int i = 0; i < n; i++) {
            ordenadosSinRepetir.add(ids[i]);
        }

        for (int i = 0; i < n; i++) {
            mapa.put(ids[i], nombres[i]);
        }

        System.out.println("Resultados ordenados por TreeSet:");
        for (Integer id : ordenadosSinRepetir) {
            System.out.println(id + " " + mapa.get(id));
        }
    }

    public void ordenarIdsConTreeMap(int[] ids, String[] nombres) {
        Map<Integer, String> mapa = new TreeMap<>();

        for (int i = 0; i < ids.length; i++) {
            mapa.put(ids[i], nombres[i]);
        }

        for (Map.Entry<Integer, String> entry : mapa.entrySet()) {
            System.out.println(entry.getKey() + " : " + entry.getValue());
        }
    }
}
