import java.util.*;
import java.util.stream.Collectors;

public class ColeccionesAvanzadasPractica {

    public void demoColecciones() {
        System.out.println("--- Demo de Colecciones Avanzadas ---");
        
        // 1. Diferencia entre Listas (ArrayList vs LinkedList)
        List<String> arrayList = new ArrayList<>();
        List<String> linkedList = new LinkedList<>();
        
        arrayList.add("Java");
        linkedList.add("Python");
        
        System.out.println("ArrayList (mejor para acceso aleatorio): " + arrayList);
        System.out.println("LinkedList (mejor para inserciones/borrados constantes): " + linkedList);

        // 2. Uso de Sets para valores únicos y ordenados
        Set<Integer> hashSet = new HashSet<>(Arrays.asList(5, 1, 2, 2, 3));
        Set<Integer> treeSet = new TreeSet<>(Arrays.asList(5, 1, 2, 3));
        
        System.out.println("HashSet (sin orden, rápido): " + hashSet);
        System.out.println("TreeSet (orden natural): " + treeSet);

        // 3. Mapas complejos (LinkedHashMap conserva orden de inserción)
        Map<String, String> linkedMap = new LinkedHashMap<>();
        linkedMap.put("Primero", "A");
        linkedMap.put("Segundo", "B");
        linkedMap.put("Tercero", "C");
        
        System.out.println("LinkedHashMap (respeta orden de inserción): " + linkedMap);

        // 4. PriorityQueue (Cola con prioridad)
        Queue<Integer> pq = new PriorityQueue<>();
        pq.offer(30);
        pq.offer(10);
        pq.offer(20);
        
        System.out.print("PriorityQueue (procesando por prioridad): ");
        while (!pq.isEmpty()) {
            System.out.print(pq.poll() + " ");
        }
        System.out.println();
    }

    public void ejerciciosAvanzados() {
        System.out.println("\n--- Ejercicios de Colecciones ---");
        System.out.println("1) Crea una lista y usa Collections.sort() para ordenarla.");
        System.out.println("2) Usa un Map para contar las palabras de un texto.");
        System.out.println("3) Implementa una cola de tareas donde las tareas urgentes salgan primero.");
        System.out.println("4) Filtra duplicados de una lista usando un Set.");
    }
}
