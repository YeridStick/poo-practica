public class BuclesPractica {

    public void imprimirSumaParesTriangulares(int[] arr) {
        for (int i = 0; i < arr.length; i++) {
            for (int j = i; j < arr.length; j++) {
                System.out.println(arr[i] + arr[j]);
            }
        }
    }

    public void imprimirSumaParesTriangularesOptimizandoAcceso(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            int ai = arr[i];
            for (int j = i; j < n; j++) {
                System.out.println(ai + arr[j]);
            }
        }
    }

    public void imprimirValoresUnicosConDobleBucle(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            int contador = 0;
            int ai = arr[i];

            for (int j = 0; j < n; j++) {
                if (ai == arr[j]) {
                    contador++;
                }
            }

            if (contador == 1) {
                System.out.println(ai);
            }
        }
    }
}
