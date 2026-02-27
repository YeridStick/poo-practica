import java.util.ArrayList;
import java.util.List;

public class PooDiaADiaPractica {

    static class Producto {
        private final String nombre;
        private final double precio;

        public Producto(String nombre, double precio) {
            if (nombre == null || nombre.isBlank()) {
                throw new IllegalArgumentException("Nombre invalido");
            }
            if (precio < 0) {
                throw new IllegalArgumentException("Precio invalido");
            }
            this.nombre = nombre;
            this.precio = precio;
        }

        public String getNombre() {
            return nombre;
        }

        public double getPrecio() {
            return precio;
        }
    }

    static class ItemCarrito {
        private final Producto producto;
        private int cantidad;

        public ItemCarrito(Producto producto, int cantidad) {
            if (producto == null) {
                throw new IllegalArgumentException("Producto requerido");
            }
            if (cantidad <= 0) {
                throw new IllegalArgumentException("Cantidad invalida");
            }
            this.producto = producto;
            this.cantidad = cantidad;
        }

        public void sumarCantidad(int extra) {
            if (extra <= 0) {
                throw new IllegalArgumentException("Cantidad extra invalida");
            }
            this.cantidad += extra;
        }

        public double subtotal() {
            return producto.getPrecio() * cantidad;
        }

        @Override
        public String toString() {
            return producto.getNombre() + " x" + cantidad + " -> " + subtotal();
        }
    }

    static class Carrito {
        private final List<ItemCarrito> items = new ArrayList<>();

        public void agregar(Producto producto, int cantidad) {
            for (ItemCarrito item : items) {
                if (item.producto.getNombre().equalsIgnoreCase(producto.getNombre())) {
                    item.sumarCantidad(cantidad);
                    return;
                }
            }
            items.add(new ItemCarrito(producto, cantidad));
        }

        public double total() {
            double total = 0;
            for (ItemCarrito item : items) {
                total += item.subtotal();
            }
            return total;
        }

        public void imprimirResumen() {
            System.out.println("=== Carrito ===");
            for (ItemCarrito item : items) {
                System.out.println(item);
            }
            System.out.println("TOTAL: " + total());
        }
    }

    public void demoTiendaSimple() {
        Producto cafe = new Producto("Cafe", 3.5);
        Producto pan = new Producto("Pan", 1.2);

        Carrito carrito = new Carrito();
        carrito.agregar(cafe, 2);
        carrito.agregar(pan, 3);
        carrito.agregar(cafe, 1);
        carrito.imprimirResumen();
    }

    public void ejerciciosRecomendados() {
        System.out.println("1) Agrega clase Cliente con email y validaciones.");
        System.out.println("2) Agrega descuento por cupon (10%, 15%).");
        System.out.println("3) Agrega metodo eliminarProducto(nombre).");
        System.out.println("4) Agrega impuesto y calcula total final.");
    }
}
