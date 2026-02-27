const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});


const modal = document.getElementById('codeModal');
const modalCode = document.getElementById('modalCode');
const closeModal = document.getElementById('closeModal');

document.querySelectorAll('.expand-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    modalCode.textContent = target.innerText.trim();
    modal.classList.add('active');
  });
});

closeModal.addEventListener('click', () => modal.classList.remove('active'));

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.classList.remove('active');
});

const editorEl = document.getElementById('javaEditor');
const editorShell = document.getElementById('editorShell');
const editorHint = document.getElementById('editorHint');
const btnExpandEditor = document.getElementById('btnExpandEditor');
const btnExpandEditorTop = document.getElementById('btnExpandEditorTop');
const lineNumbersEl = document.getElementById('lineNumbers');
const snippetPanel = document.getElementById('snippetPanel');
const expectedLevelOutputEl = document.getElementById('expectedLevelOutput');
const coachLevelOutputEl = document.getElementById('coachLevelOutput');
const stepsLevelOutputEl = document.getElementById('stepsLevelOutput');
const infoLevelOutputEl = document.getElementById('infoLevelOutput');

// Theme Switcher Elements
const themeModal = document.getElementById('themeModal');
const btnConfig = document.getElementById('btnConfig');
const closeThemeModal = document.getElementById('closeThemeModal');
const themeCards = document.querySelectorAll('.theme-card');

const snippetDefs = {
  soup: { label: 'System.out.println()', body: 'System.out.println();', caretOffset: 'System.out.println('.length },
  sout: { label: 'println con texto', body: 'System.out.println("");', caretOffset: 'System.out.println("'.length },
  soutv: { label: 'println variable', body: 'System.out.println("valor = " + valor);', caretOffset: 'System.out.println("valor = " + '.length },
  fori: { label: 'for int i', body: 'for (int i = 0; i < ; i++) {\n    \n}', caretOffset: 'for (int i = 0; i < '.length },
  main: { label: 'main method', body: 'public static void main(String[] args) {\n    \n}', caretOffset: 'public static void main(String[] args) {\n    '.length },
  psvm: { label: 'alias main', body: 'public static void main(String[] args) {\n    \n}', caretOffset: 'public static void main(String[] args) {\n    '.length }
};

// Context Menu Elements
const editorContextMenu = document.getElementById('editorContextMenu');

function setEditorHint(text) {
  editorHint.innerHTML = text;
}

function updateExpandButtons(isFull) {
  const txt = isFull ? 'Reducir' : 'Ampliar';
  btnExpandEditor.textContent = txt;
  btnExpandEditorTop.textContent = isFull ? 'Salir' : 'Pantalla completa';
}

let originalParent = null;
let editorPlaceholder = null;

function toggleEditorFullscreen() {
  const isFull = editorShell.classList.toggle('fullscreen');
  document.body.classList.toggle('editor-is-fullscreen', isFull);

  if (isFull) {
    // Porta: Mover al body para romper cualquier stacking context
    originalParent = editorShell.parentElement;
    editorPlaceholder = document.createElement('div');
    editorPlaceholder.style.height = editorShell.offsetHeight + 'px';
    editorPlaceholder.style.width = '100%';
    editorPlaceholder.id = 'editor-placeholder';
    originalParent.insertBefore(editorPlaceholder, editorShell);
    document.body.appendChild(editorShell);
  } else {
    // Regresar a su lugar original
    if (originalParent && editorPlaceholder) {
      originalParent.insertBefore(editorShell, editorPlaceholder);
      editorPlaceholder.remove();
      editorPlaceholder = null;
    }
  }

  updateExpandButtons(isFull);
  document.body.style.overflow = isFull ? 'hidden' : '';

  // Asegurar que el scroll se mantenga sincronizado tras el portal
  setTimeout(() => {
    syncLineScroll();
    editorEl.focus();
  }, 10);
}
window.toggleEditorFullscreen = toggleEditorFullscreen;

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && editorShell.classList.contains('fullscreen')) {
    toggleEditorFullscreen();
  }
});

window.addEventListener('resize', () => {
  autoResizeEditor();
  syncLineScroll();
});

function replaceInEditor(start, end, replacement, caretPos) {
  const value = editorEl.value;
  editorEl.value = value.slice(0, start) + replacement + value.slice(end);
  editorEl.selectionStart = caretPos;
  editorEl.selectionEnd = caretPos;
}

function renderHighlight() {
  // Resaltado de sintaxis desactivado para mantener el editor estable.
}

function autoResizeEditor() {
  // Desactivamos el redimensionado automático para evitar que el editor crezca indefinidamente.
  // Ahora el editor tiene una altura fija en CSS con scroll interno.
}

function updateLineNumbers() {
  const lines = editorEl.value.split('\n').length;
  let out = '';
  for (let i = 1; i <= lines; i++) {
    out += i + '\n';
  }
  lineNumbersEl.textContent = out;
  autoResizeEditor();
}

function syncLineScroll() {
  lineNumbersEl.scrollTop = editorEl.scrollTop;
}

// Escuchar el scroll del editor para sincronizar los números de línea
editorEl.addEventListener('scroll', syncLineScroll);

function getWordBounds() {
  const start = editorEl.selectionStart;
  const end = editorEl.selectionEnd;
  if (start !== end) return null;
  const value = editorEl.value;
  let wordStart = start;
  while (wordStart > 0 && /[A-Za-z_]/.test(value.charAt(wordStart - 1))) {
    wordStart--;
  }
  let wordEnd = start;
  while (wordEnd < value.length && /[A-Za-z_]/.test(value.charAt(wordEnd))) {
    wordEnd++;
  }
  return { wordStart, wordEnd, token: value.slice(wordStart, start), fullToken: value.slice(wordStart, wordEnd) };
}

function expandSnippet(key) {
  const def = snippetDefs[key];
  if (!def) return false;
  const bounds = getWordBounds();
  if (!bounds) return false;
  const caret = bounds.wordStart + def.caretOffset;
  replaceInEditor(bounds.wordStart, bounds.wordEnd, def.body, caret);
  updateLineNumbers();
  renderHighlight();
  syncLineScroll();
  setEditorHint('Snippet aplicado: <strong>' + key + '</strong> -> ' + def.label);
  renderSnippetSuggestions();
  return true;
}

function tryAutoExpandFromToken() {
  const bounds = getWordBounds();
  if (!bounds) return false;
  const token = bounds.token;
  if (!token || !snippetDefs[token]) return false;
  return expandSnippet(token);
}

function renderSnippetSuggestions() {
  const bounds = getWordBounds();
  if (!bounds) {
    snippetPanel.classList.remove('show');
    snippetPanel.innerHTML = '';
    return;
  }
  const token = bounds.token.toLowerCase();
  if (!token) {
    snippetPanel.classList.remove('show');
    snippetPanel.innerHTML = '';
    setEditorHint('Tip: escribe <strong>soup</strong>, <strong>fori</strong> o <strong>main</strong>');
    return;
  }
  const keys = Object.keys(snippetDefs).filter(k => k.startsWith(token)).slice(0, 6);
  if (keys.length === 0) {
    snippetPanel.classList.remove('show');
    snippetPanel.innerHTML = '';
    return;
  }
  snippetPanel.innerHTML = keys.map(k =>
    `<button class="snippet-chip" data-snippet="${k}">${k} -> ${snippetDefs[k].label}</button>`
  ).join('');
  snippetPanel.classList.add('show');
  snippetPanel.querySelectorAll('.snippet-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      expandSnippet(btn.dataset.snippet);
      editorEl.focus();
    });
  });
  setEditorHint('Sugerencias: pulsa chip o <span class="kbd">Tab</span>/<span class="kbd">Espacio</span> para expandir');
}

function indentSelection() {
  const start = editorEl.selectionStart;
  const end = editorEl.selectionEnd;
  const value = editorEl.value;
  const indent = '    ';

  if (start === end) {
    replaceInEditor(start, end, indent, start + indent.length);
    return;
  }

  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = value.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = value.length;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split('\n');
  const indented = lines.map(l => indent + l).join('\n');
  editorEl.value = value.slice(0, lineStart) + indented + value.slice(lineEnd);

  editorEl.selectionStart = start + indent.length;
  editorEl.selectionEnd = end + indent.length * lines.length;
}

function outdentSelection() {
  const start = editorEl.selectionStart;
  const end = editorEl.selectionEnd;
  const value = editorEl.value;
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  let lineEnd = value.indexOf('\n', end);
  if (lineEnd === -1) lineEnd = value.length;
  const block = value.slice(lineStart, lineEnd);
  const lines = block.split('\n');

  let removedTotal = 0;
  const outdentedLines = lines.map(line => {
    if (line.startsWith('    ')) {
      removedTotal += 4;
      return line.slice(4);
    }
    if (line.startsWith('\t')) {
      removedTotal += 1;
      return line.slice(1);
    }
    return line;
  });

  editorEl.value = value.slice(0, lineStart) + outdentedLines.join('\n') + value.slice(lineEnd);
  editorEl.selectionStart = Math.max(lineStart, start - 4);
  editorEl.selectionEnd = Math.max(editorEl.selectionStart, end - removedTotal);
}

function insertNewLineWithIndent() {
  const cursor = editorEl.selectionStart;
  const value = editorEl.value;
  const lineStart = value.lastIndexOf('\n', cursor - 1) + 1;
  const currentLine = value.slice(lineStart, cursor);
  const indentMatch = currentLine.match(/^\s*/);
  const baseIndent = indentMatch ? indentMatch[0] : '';
  const extraIndent = currentLine.trimEnd().endsWith('{') ? '    ' : '';
  const insertion = '\n' + baseIndent + extraIndent;
  replaceInEditor(cursor, cursor, insertion, cursor + insertion.length);
}

editorEl.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    e.preventDefault();
    if (tryAutoExpandFromToken()) return;
    if (e.shiftKey) {
      outdentSelection();
    } else {
      indentSelection();
    }
    updateLineNumbers();
    renderHighlight();
    renderSnippetSuggestions();
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    if (tryAutoExpandFromToken()) {
      insertNewLineWithIndent();
    } else {
      insertNewLineWithIndent();
    }
    updateLineNumbers();
    renderHighlight();
    renderSnippetSuggestions();
    return;
  }

  if (e.key === ' ') {
    if (tryAutoExpandFromToken()) {
      e.preventDefault();
      const cursor = editorEl.selectionStart;
      replaceInEditor(cursor, cursor, ' ', cursor + 1);
      updateLineNumbers();
      renderHighlight();
      renderSnippetSuggestions();
    }
  }
});

editorEl.addEventListener('scroll', syncLineScroll);
editorEl.addEventListener('click', renderSnippetSuggestions);

editorEl.addEventListener('input', () => {
  updateLineNumbers();
  renderHighlight();
  syncLineScroll();
  renderSnippetSuggestions();
});

const niveles = {
  nivel1: {
    order: 1,
    expected: ['Hola, soy Ana'],
    expectedText: 'Objetivo del comentario: crear Persona y mostrar "Hola, soy Ana".',
    coach: `Tarea extra del comentario:
1) Crear clase Direccion (ciudad, pais)
2) Asociarla a Persona.`,
    steps: `Pasos concretos:
1) Crea clase Persona con atributo privado 'nombre'.
2) Crea constructor Persona(String nombre).
3) Crea metodo String saludar().
4) En Main, instancia Persona("Ana") e imprime p.saludar().`,
    info: `Concepto clave:
- Clase: plantilla (Persona).
- Objeto: instancia concreta (new Persona("Ana")).
- Encapsulacion basica: atributo privado + metodos.`,
    template: `/*
EJERCICIO NIVEL 1 (POO BASE)
Objetivo:
- Crear objeto Persona y usar metodo saludar().

Tarea extra:
- Crear clase Direccion (ciudad, pais)
- Asociarla a Persona
*/
class Persona {
    private String nombre;
    Persona(String nombre) { this.nombre = nombre; }
    String saludar() { return "Hola, soy " + nombre; }
}

public class Main {
    public static void main(String[] args) {
        Persona p = new Persona("Ana");
        System.out.println(p.saludar());
    }
}`
  },
  nivel2: {
    order: 2,
    expected: ['TOTAL: 10.5'],
    expectedText: 'Objetivo del comentario: modelar Producto y calcular total (Total/TOTAL con numero positivo).',
    matchRegex: /total\s*:\s*(\d+(?:\.\d+)?)/i,
    minValue: 0.0,
    coach: `Tarea extra del comentario:
Crear clase Carrito que reciba varios productos.`,
    steps: `Pasos concretos:
1) Crea clase Producto con nombre y precio.
2) Crea clase Carrito con ArrayList<Producto> productos.
3) Agrega metodo agregarProducto(Producto p).
4) Agrega metodo totalProducto() que recorra la lista y sume precios.
5) En Main, agrega varios productos e imprime Total.`,
    info: `Concepto clave (ArrayList de objetos):
- ArrayList<Producto> guarda objetos Producto.
- productos.add(p) agrega una referencia al objeto.
- for (Producto p : productos) recorre cada objeto y permite leer sus campos/metodos.
- Se usa ArrayList cuando el tamano cambia dinamicamente.`,
    template: `/*
EJERCICIO NIVEL 2 (ENCAPSULACION)
Objetivo:
- Modelar Producto y calcular total.

Tarea extra:
- Crear clase Carrito que reciba varios productos.
*/
class Producto {
    String nombre;
    double precio;
    Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto cafe = new Producto("Cafe", 3.5);
        double total = cafe.precio * 3;
        System.out.println("TOTAL: " + total);
    }
}`
  },
  nivel3: {
    order: 3,
    expected: ['Notificacion EMAIL a Ana', 'Notificacion SMS a Ana'],
    expectedText: 'Objetivo del comentario: abstraccion + herencia + polimorfismo. Debe imprimir EMAIL y SMS para Ana.',
    coach: `Tarea extra del comentario:
Agrega NotificadorPush y recorre todos con una sola referencia base.`,
    steps: `Pasos concretos:
1) Crea clase abstracta EXACTA: NotificadorBase.
2) En NotificadorBase define: protected String canal y abstract String notificar(String destino).
3) Crea NotificadorEmail extends NotificadorBase.
4) Crea NotificadorSms extends NotificadorBase.
5) En Main crea arreglo NotificadorBase[] y recorre con for-each para imprimir.`,
    info: `Concepto clave:
- Herencia: una clase hija extiende una base.
- Abstraccion: clase abstracta define contrato comun y evita instanciar la base.
- Polimorfismo: variable tipo NotificadorBase apunta to Email/Sms y ejecuta su implementacion real.`,
    template: `/*
EJERCICIO NIVEL 3 (HERENCIA + ABSTRACCION + POLIMORFISMO)
Objetivo:
- Crear una clase abstracta y extenderla.
- Implementar comportamiento concreto en subclase.
- Usar polimorfismo con referencia de tipo base.

Tarea extra:
- Crear NotificadorPush extendiendo la abstracta.
*/
abstract class NotificadorBase {
    protected String canal;

    public NotificadorBase(String canal) {
        this.canal = canal;
    }

    abstract String notificar(String destino);
}

class NotificadorEmail extends NotificadorBase {
    public NotificadorEmail() {
        super("EMAIL");
    }

    @Override
    String notificar(String destino) {
        return "Notificacion " + canal + " a " + destino;
    }
}

class NotificadorSms extends NotificadorBase {
    public NotificadorSms() {
        super("SMS");
    }

    @Override
    String notificar(String destino) {
        return "Notificacion " + canal + " a " + destino;
    }
}

public class Main {
    public static void main(String[] args) {
        NotificadorBase[] notificaciones = {
            new NotificadorEmail(),
            new NotificadorSms()
        };

        for (NotificadorBase n : notificaciones) {
            System.out.println(n.notificar("Ana"));
        }
    }
}`
  },
  nivel4: {
    order: 4,
    expected: ['Suma pares x10: 120'],
    expectedText: 'Objetivo del comentario: usar stream con filter/map/reduce (ejemplo: Suma pares x10: 120).',
    coach: `Tarea extra del comentario:
Resolver el mismo caso con for tradicional y comparar.`,
    steps: `Pasos concretos:
1) Crea lista de enteros [1,2,3,4,5,6].
2) Usa filter para quedarte con pares.
3) Usa map para multiplicar por 10.
4) Usa reduce para sumar.
5) Imprime resultado final.`,
    info: `Concepto clave:
- filter: selecciona elementos.
- map: transforma cada elemento.
- reduce: combina elementos en un unico valor.`,
    template: `/*
EJERCICIO NIVEL 4 (FUNCIONAL)
Objetivo:
- Usar stream con filter/map/reduce.

Tarea extra:
- Resolver el mismo caso con for tradicional y comparar.
*/
import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1,2,3,4,5,6);
        int suma = nums.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * 10)
            .reduce(0, Integer::sum);
        System.out.println("Suma pares x10: " + suma);
    }
}`
  },
  nivel5: {
    order: 5,
    expected: ['TOTAL TARJETA: 103.0', 'TOTAL TRANSFERENCIA: 99.0'],
    expectedText: 'Debe imprimir dos totales usando Strategy: tarjeta=103.0 y transferencia=99.0.',
    coach: `Tarea extra:
Agrega PagoEfectivo con 5% descuento y pruebalo tambien.`,
    steps: `Pasos concretos:
1) Crea interfaz MetodoPago con pagar(double monto).
2) Implementa PagoTarjeta y PagoTransferencia.
3) Crea Checkout que reciba MetodoPago.
4) Calcula monto 100 con ambos metodos e imprime resultados.`,
    info: `Concepto clave:
- Strategy separa el algoritmo de la clase cliente.
- Cambias comportamiento inyectando otra implementacion.`,
    template: `/*
EJERCICIO NIVEL 5 (STRATEGY)
Objetivo:
- Cambiar algoritmo de pago sin tocar el cliente.
*/
interface MetodoPago {
    double pagar(double monto);
}

class PagoTarjeta implements MetodoPago {
    public double pagar(double monto) { return monto * 1.03; }
}

class PagoTransferencia implements MetodoPago {
    public double pagar(double monto) { return monto * 0.99; }
}

class Checkout {
    private MetodoPago metodo;
    Checkout(MetodoPago metodo) { this.metodo = metodo; }
    double confirmar(double monto) { return metodo.pagar(monto); }
}

public class Main {
    public static void main(String[] args) {
        Checkout c1 = new Checkout(new PagoTarjeta());
        Checkout c2 = new Checkout(new PagoTransferencia());
        System.out.println("TOTAL TARJETA: " + c1.confirmar(100));
        System.out.println("TOTAL TRANSFERENCIA: " + c2.confirmar(100));
    }
}`
  },
  nivel6: {
    order: 6,
    expected: ['CREADO: EMAIL', 'CREADO: SMS'],
    expectedText: 'Debe imprimir CREADO: EMAIL y CREADO: SMS usando una Factory.',
    coach: `Tarea extra:
Agrega tipo PUSH en la factory y validalo.`,
    steps: `Pasos concretos:
1) Crea interfaz Notificador con tipo().
2) Implementa NotificadorEmail y NotificadorSms.
3) Crea NotificadorFactory.crear(String tipo).
4) Imprime los tipos creados por la fabrica.`,
    info: `Concepto clave:
- Factory centraliza la creacion y evita muchos new dispersos.`,
    template: `/*
EJERCICIO NIVEL 6 (FACTORY)
Objetivo:
- Centralizar creacion de objetos por tipo.
*/
interface Notificador {
    String tipo();
}

class NotificadorEmail implements Notificador {
    public String tipo() { return "EMAIL"; }
}

class NotificadorSms implements Notificador {
    public String tipo() { return "SMS"; }
}

class NotificadorFactory {
    static Notificador crear(String tipo) {
        if ("email".equalsIgnoreCase(tipo)) return new NotificadorEmail();
        if ("sms".equalsIgnoreCase(tipo)) return new NotificadorSms();
        throw new IllegalArgumentException("Tipo no soportado");
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("CREADO: " + NotificadorFactory.crear("email").tipo());
        System.out.println("CREADO: " + NotificadorFactory.crear("sms").tipo());
    }
}`
  },
  nivel7: {
    order: 7,
    expected: ['ALERTA: stock bajo SKU-CAFE -> 2'],
    expectedText: 'Debe imprimir una alerta al bajar stock a 2.',
    coach: `Tarea extra:
Agrega un segundo observador para log en consola.`,
    steps: `Pasos concretos:
1) Crea interfaz ObservadorStock con actualizar(sku, stock).
2) Crea AlertaStockBajo.
3) Crea Inventario con lista de observadores.
4) Notifica a todos cuando cambie el stock.`,
    info: `Concepto clave:
- Observer desacopla el emisor (Inventario) de quienes reaccionan.`,
    template: `/*
EJERCICIO NIVEL 7 (OBSERVER)
Objetivo:
- Notificar observadores cuando cambia el estado.
*/
import java.util.ArrayList;
import java.util.List;

interface ObservadorStock {
    void actualizar(String sku, int stock);
}

class AlertaStockBajo implements ObservadorStock {
    public void actualizar(String sku, int stock) {
        if (stock <= 2) {
            System.out.println("ALERTA: stock bajo " + sku + " -> " + stock);
        }
    }
}

class Inventario {
    private List<ObservadorStock> observadores = new ArrayList<>();
    void registrar(ObservadorStock o) { observadores.add(o); }
    void actualizarStock(String sku, int stock) {
        for (ObservadorStock o : observadores) o.actualizar(sku, stock);
    }
}

public class Main {
    public static void main(String[] args) {
        Inventario inv = new Inventario();
        inv.registrar(new AlertaStockBajo());
        inv.actualizarStock("SKU-CAFE", 5);
        inv.actualizarStock("SKU-CAFE", 2);
    }
}`
  },
  nivel8: {
    order: 8,
    expected: ['CATEGORIAS: 2', 'PROMEDIO CAFE: 4.0'],
    expectedText: 'Debe imprimir categorias=2 y promedio de CAFE=4.0.',
    coach: `Tarea extra:
Ordena categorias alfabeticamente antes de imprimir.`,
    steps: `Pasos concretos:
1) Crea clase Item(categoria, precio).
2) Crea lista de items.
3) Agrupa por categoria con groupingBy.
4) Calcula promedio por categoria.
5) Imprime cantidad de categorias y promedio CAFE.`,
    info: `Concepto clave:
- groupingBy + averagingDouble permite resumir datos por grupo.`,
    template: `/*
EJERCICIO NIVEL 8 (FUNCIONAL AVANZADO)
Objetivo:
- Agrupar por categoria y calcular promedios.
*/
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class Item {
    String categoria;
    double precio;
    Item(String categoria, double precio) {
        this.categoria = categoria;
        this.precio = precio;
    }
}

public class Main {
    public static void main(String[] args) {
        List<Item> items = Arrays.asList(
            new Item("CAFE", 3.0),
            new Item("CAFE", 5.0),
            new Item("PAN", 2.0)
        );

        Map<String, Double> promedio = items.stream()
            .collect(Collectors.groupingBy(i -> i.categoria, Collectors.averagingDouble(i -> i.precio)));

        System.out.println("CATEGORIAS: " + promedio.size());
        System.out.println("PROMEDIO CAFE: " + promedio.get("CAFE"));
    }
}`
  }
};

let nivelActual = null;
let currentRepo = 'standard';
let collections = {
  standard: {
    nombre: 'Standard',
    niveles: niveles // Usa el objeto niveles existente
  }
};
let repoCargadoTemporal = null; // Para guardar el repo que se acaba de cargar antes de persistir

function renderRetos() {
  const container = document.getElementById('retos-container');
  if (!container) return;
  container.innerHTML = '';

  const repoData = collections[currentRepo];
  if (!repoData) return;

  Object.keys(repoData.niveles).forEach((id, index) => {
    const cfg = repoData.niveles[id];
    const order = cfg.order || (index + 1);
    const done = localStorage.getItem(`poo_${currentRepo}_nivel_${order}`) === '1';

    // El primer nivel siempre desbloqueado, o si el anterior esta hecho
    let locked = true;
    if (order === 1) locked = false;
    else {
      const prevDone = localStorage.getItem(`poo_${currentRepo}_nivel_${order - 1}`) === '1';
      if (prevDone) locked = false;
    }

    const card = document.createElement('article');
    card.id = `lvl-${currentRepo}-${order}`;
    card.className = `level-card ${locked ? 'locked' : ''}`;

    card.innerHTML = `
      <div>
        <h4 style="margin: 0; color: var(--brand);">${cfg.titulo || 'Nivel ' + order}</h4>
        <p style="font-size: 0.85rem; margin: 10px 0;">${cfg.descripcion || cfg.expectedText || ''}</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
        <span id="status-${currentRepo}-${order}" class="status-pill ${done ? 'ok' : 'pending'}">
          ${done ? 'Completado' : (locked ? 'Bloqueado' : 'Pendiente')}
        </span>
        <button id="btn-${currentRepo}-${order}-check" class="action" ${locked ? 'disabled' : ''} 
          style="padding: 5px 12px; font-size: 0.75rem;" onclick="validarNivelRepo('${currentRepo}', '${id}')">Validar</button>
        <button id="btn-${currentRepo}-${order}-load" class="action" ${locked ? 'disabled' : ''} 
          style="padding: 5px 12px; font-size: 0.75rem; background: var(--brand);" onclick="cargarEjercicioRepo('${currentRepo}', '${id}')">Cargar</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function switchRepo(repoId) {
  document.body.classList.remove('free-practice-mode');
  currentRepo = repoId;
  const repoData = collections[repoId];
  if (!repoData) return;

  // Actualizar titulo del playground
  document.getElementById('playground-title').textContent = `Playground Java - ${repoData.nombre}`;

  // Actualizar UI de pestañas
  document.querySelectorAll('.repo-tab').forEach(btn => {
    btn.classList.remove('active');
    btn.style.background = 'transparent';
    btn.style.color = 'var(--brand)';
  });

  const activeBtn = Array.from(document.querySelectorAll('.repo-tab')).find(b => b.textContent === repoData.nombre);
  if (activeBtn) {
    activeBtn.classList.add('active');
    activeBtn.style.background = 'var(--brand)';
    activeBtn.style.color = 'white';
  }

  renderRetos();
}
window.switchRepo = switchRepo;

function cargarEjercicioRepo(repoId, levelId) {
  const cfg = collections[repoId].niveles[levelId];
  if (!cfg) return;
  nivelActual = { repoId, levelId };
  editorEl.value = cfg.template;
  editorEl.focus();
  updateLineNumbers();
  renderHighlight();
  syncLineScroll();
  renderSnippetSuggestions();

  expectedLevelOutputEl.textContent = cfg.expectedText || cfg.descripcion || '';
  coachLevelOutputEl.textContent = cfg.coach || 'Sin sugerencia adicional.';
  stepsLevelOutputEl.textContent = cfg.steps || 'Sin pasos concretos definidos.';
  infoLevelOutputEl.textContent = cfg.info || 'Sin explicacion conceptual definida.';
  setEditorHint(`Reto de ${collections[repoId].nombre} cargado.`);
}
window.cargarEjercicioRepo = cargarEjercicioRepo;

function validarNivelRepo(repoId, levelId) {
  const cfg = collections[repoId].niveles[levelId];
  if (!cfg) return;
  const salida = document.getElementById('runOutput').textContent || '';
  let ok = false;

  if (cfg.matchRegex) {
    const m = salida.match(cfg.matchRegex);
    if (m) {
      const value = Number(m[1]);
      ok = Number.isFinite(value) && value > (cfg.minValue ?? -Infinity);
    }
  } else if (cfg.expected) {
    ok = cfg.expected.every(token => salida.includes(token));
  } else {
    // Si no hay validacion especifica (repos externos), marcamos como "revisado" si hay salida
    ok = salida.trim().length > 0;
  }

  const order = cfg.order || (Object.keys(collections[repoId].niveles).indexOf(levelId) + 1);
  if (ok) {
    localStorage.setItem(`poo_${repoId}_nivel_${order}`, '1');
    setEditorHint('Nivel completado! Buen trabajo.');
    renderRetos();
  } else {
    setEditorHint('La salida no coincide o esta vacia. Sigue intentando!');
  }
}
window.validarNivelRepo = validarNivelRepo;

function cargarEjercicioNivel(id) {
  const cfg = niveles[id];
  if (!cfg) return;
  nivelActual = id;
  editorEl.value = cfg.template;
  editorEl.focus();
  updateLineNumbers();
  renderHighlight();
  syncLineScroll();
  renderSnippetSuggestions();
  expectedLevelOutputEl.textContent = cfg.expectedText;
  coachLevelOutputEl.textContent = cfg.coach || 'Sin sugerencia adicional.';
  stepsLevelOutputEl.textContent = cfg.steps || 'Sin pasos concretos definidos.';
  infoLevelOutputEl.textContent = cfg.info || 'Sin explicacion conceptual definida.';
  setEditorHint('Nivel cargado con guia. Ejecuta, mejora el codigo y valida.');
}
window.cargarEjercicioNivel = cargarEjercicioNivel;

function validarNivel(id) {
  const cfg = niveles[id];
  if (!cfg) return;
  const salida = document.getElementById('runOutput').textContent || '';
  let ok = false;
  if (cfg.matchRegex) {
    const m = salida.match(cfg.matchRegex);
    if (m) {
      const value = Number(m[1]);
      ok = Number.isFinite(value) && value > (cfg.minValue ?? -Infinity);
    }
  } else {
    ok = cfg.expected.every(token => salida.includes(token));
  }
  const status = document.getElementById('status-' + id);
  if (ok) {
    localStorage.setItem('poo_nivel_' + cfg.order, '1');
    if (status) {
      status.textContent = 'Completado';
      status.className = 'level-status ok';
    }
    desbloquearNivel(cfg.order);
    actualizarEstadoNiveles();
    setEditorHint('Nivel completado. Ya puedes avanzar al siguiente.');
  } else {
    if (status && status.textContent !== 'Completado') {
      status.textContent = 'Aun no pasa';
      status.className = 'level-status pending';
    }
    setEditorHint('La salida no coincide. Revisa la prueba esperada.');
  }
}
window.validarNivel = validarNivel;

const templates = {
  hola: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hola desde playground");
    }
}`,
  strategy: `interface Notificador {
    void enviar(String destino, String mensaje);
}

class NotificadorEmail implements Notificador {
    public void enviar(String destino, String mensaje) {
        System.out.println("Email a " + destino + ": " + mensaje);
    }
}

public class Main {
    public static void main(String[] args) {
        Notificador n = new NotificadorEmail();
        n.enviar("ana@mail.com", "Pedido enviado");
    }
}`,
  scope: `public class Main {
    static int contador = 0;

    public static void main(String[] args) {
        String nombre = "Ana";
        if (nombre.length() > 0) {
            String bloque = "OK";
            System.out.println("Dentro del bloque: " + bloque);
        }
        contador++;
        System.out.println("Nombre: " + nombre);
        System.out.println("Contador static: " + contador);
    }
}`,
  oop: `class Producto {
    String nombre;
    double precio;
    Producto(String nombre, double precio) {
        this.nombre = nombre;
        this.precio = precio;
    }
}

public class Main {
    public static void main(String[] args) {
        Producto cafe = new Producto("Cafe", 3.5);
        Producto pan = new Producto("Pan", 1.2);
        double total = cafe.precio * 2 + pan.precio * 3;
        System.out.println("Total carrito: " + total);
    }
}`,
  patrones: `interface MetodoPago {
    double pagar(double monto);
}

class PagoTarjeta implements MetodoPago {
    public double pagar(double monto) { return monto * 1.03; }
}

class PagoTransferencia implements MetodoPago {
    public double pagar(double monto) { return monto * 0.99; }
}

public class Main {
    public static void main(String[] args) {
        MetodoPago metodo = new PagoTarjeta();
        System.out.println("Total: " + metodo.pagar(100));
    }
}`,
  funcional: `import java.util.Arrays;
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = Arrays.asList(1,2,3,4,5,6);
        int sumaPares = nums.stream()
            .filter(n -> n % 2 == 0)
            .map(n -> n * 10)
            .reduce(0, Integer::sum);
        System.out.println("Suma pares x10: " + sumaPares);
    }
}`
};

function cargarPlantilla(tipo) {
  editorEl.value = templates[tipo] || templates.hola;
  editorEl.focus();
  updateLineNumbers();
  renderHighlight();
  syncLineScroll();
  renderSnippetSuggestions();
  setEditorHint('Plantilla cargada. Usa snippets: <strong>soup</strong>, <strong>soutv</strong>, <strong>fori</strong>, <strong>main</strong>.');
}
window.cargarPlantilla = cargarPlantilla;

async function ejecutarJava() {
  const editor = document.getElementById('javaEditor');
  const out = document.getElementById('runOutput');
  out.textContent = "Ejecutando...";
  try {
    const res = await fetch('/run-java', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
      body: editor.value
    });
    const text = await res.text();
    out.textContent = text;
  } catch (err) {
    out.textContent = "Error llamando al backend: " + err;
  }
}
window.ejecutarJava = ejecutarJava;

function descargarEjercicio() {
  const code = editorEl.value || '';
  if (!code.trim()) {
    setEditorHint('No hay codigo para descargar.');
    return;
  }

  const base = (nivelActual && niveles[nivelActual])
    ? ('ejercicio_' + nivelActual + '_resuelto')
    : 'Main_resuelto';
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');
  const fileName = `${base}_${stamp}.java`;

  const blob = new Blob([code], { type: 'text/x-java-source;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  setEditorHint(`Archivo descargado: <strong>${fileName}</strong>`);
}
window.descargarEjercicio = descargarEjercicio;

async function probarBackend() {
  const box = document.getElementById('backendStatus');
  box.textContent = "Consultando /health...";
  try {
    const res = await fetch('/health');
    const text = await res.text();
    box.textContent = 'OK: ' + text;
  } catch (err) {
    box.textContent = 'Error: ' + err;
  }
}
window.probarBackend = probarBackend;

async function cargarDesdeRepo() {
  const url = document.getElementById('repoUrl').value.trim();
  const status = document.getElementById('backendStatus');

  if (!url) {
    setEditorHint('Introduce una URL de repositorio.');
    return;
  }

  status.textContent = "Clonando y analizando repositorio... (esto puede tardar unos segundos)";
  try {
    const res = await fetch('/repo/load', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
      body: url
    });

    if (!res.ok) {
      const errText = await res.text();
      status.textContent = "Error: " + errText;
      return;
    }

    const data = await res.json();
    status.textContent = `¡Exito! Se encontraron ${data.ejercicios.length} retos.`;

    // Procesar ejercicios para que coincidan con el formato esperado
    const repoNombre = url.split('/').pop().replace('.git', '');
    const repoId = "repo_" + Date.now();
    const nuevosNiveles = {};
    data.ejercicios.forEach((ej, idx) => {
      nuevosNiveles[`nivel_${idx + 1}`] = {
        order: idx + 1,
        titulo: ej.titulo,
        descripcion: ej.descripcion,
        template: ej.template,
        expected: ej.output_esperado || ej.expected || null
      };
    });

    // Agregar a colecciones temporalmente para vista previa
    repoCargadoTemporal = {
      id: repoId,
      data: {
        nombre: repoNombre,
        niveles: nuevosNiveles
      }
    };
    collections[repoId] = repoCargadoTemporal.data;

    // Mostrar boton de guardar
    document.getElementById('btnSaveRepo').style.display = 'inline-block';

    // Agregar pestaña
    addRepoTab(repoId, repoNombre);

    // Cambiar al nuevo repo
    switchRepo(repoId);

    setEditorHint(`Repositorio <strong>${repoNombre}</strong> cargado con ${data.ejercicios.length} retos. Pulsa <strong>Guardar</strong> para mantenerlo.`);
  } catch (err) {
    status.textContent = "Error de red o servidor: " + err;
    console.error(err);
  }
}
window.cargarDesdeRepo = cargarDesdeRepo;


updateExpandButtons(false);
updateLineNumbers();
renderHighlight();
syncLineScroll();
renderSnippetSuggestions();

// --- PERSISTENCIA DE REPOSITORIOS ---

function renderReposGuardados() {
  const container = document.getElementById('saved-repos-list');
  const wrapper = document.getElementById('saved-repos-container');
  if (!container || !wrapper) return;

  const saved = JSON.parse(localStorage.getItem('poo_saved_repos') || '{}');
  const ids = Object.keys(saved);

  if (ids.length === 0) {
    wrapper.style.display = 'none';
    return;
  }

  wrapper.style.display = 'block';
  container.innerHTML = '';

  ids.forEach(id => {
    const repo = saved[id];
    const btn = document.createElement('div');
    btn.style.cssText = "display: flex; align-items: center; gap: 5px; background: rgba(0,0,0,0.05); padding: 5px 12px; border-radius: 15px; font-size: 0.75rem;";

    const clickArea = document.createElement('span');
    clickArea.textContent = repo.nombre;
    clickArea.style.cursor = 'pointer';
    clickArea.onclick = () => {
      if (!collections[id]) {
        collections[id] = repo;
        addRepoTab(id, repo.nombre);
      }
      switchRepo(id);
    };

    const delBtn = document.createElement('span');
    delBtn.textContent = '×';
    delBtn.style.cssText = "font-weight: bold; cursor: pointer; color: #ff4d4d; margin-left: 5px; font-size: 1rem;";
    delBtn.onclick = (e) => {
      e.stopPropagation();
      eliminarRepositorio(id);
    };

    btn.appendChild(clickArea);
    btn.appendChild(delBtn);
    container.appendChild(btn);
  });
}

function guardarRepositorioActual() {
  if (!repoCargadoTemporal) return;

  const saved = JSON.parse(localStorage.getItem('poo_saved_repos') || '{}');
  saved[repoCargadoTemporal.id] = repoCargadoTemporal.data;
  localStorage.setItem('poo_saved_repos', JSON.stringify(saved));

  document.getElementById('btnSaveRepo').style.display = 'none';
  setEditorHint(`Repositorio <strong>${repoCargadoTemporal.data.nombre}</strong> guardado permanentemente.`);
  renderReposGuardados();
}
window.guardarRepositorioActual = guardarRepositorioActual;

function eliminarRepositorio(id) {
  if (!confirm('¿Seguro que quieres eliminar este repositorio guardado?')) return;

  const saved = JSON.parse(localStorage.getItem('poo_saved_repos') || '{}');
  delete saved[id];
  localStorage.setItem('poo_saved_repos', JSON.stringify(saved));

  // Si estamos en ese repo, volver al standard
  if (currentRepo === id) {
    switchRepo('standard');
  }

  // Eliminar pestaña si existe
  const tabs = document.querySelectorAll('.repo-tab');
  tabs.forEach(tab => {
    if (tab.getAttribute('data-repo-id') === id) {
      tab.remove();
    }
  });

  renderReposGuardados();
}

function addRepoTab(id, nombre) {
  const slider = document.getElementById('repo-slider');
  const btn = document.createElement('button');
  btn.className = "repo-tab";
  btn.setAttribute('data-repo-id', id);
  btn.textContent = nombre;
  btn.style.cssText = "padding: 8px 15px; border-radius: 20px; border: 1px solid var(--brand); background: transparent; color: var(--brand); cursor: pointer; white-space: nowrap; font-size: 0.85rem;";
  btn.onclick = () => switchRepo(id);
  slider.appendChild(btn);
}

function cargarRepositoriosGuardados() {
  const saved = JSON.parse(localStorage.getItem('poo_saved_repos') || '{}');
  Object.keys(saved).forEach(id => {
    collections[id] = saved[id];
    addRepoTab(id, saved[id].nombre);
  });
  renderReposGuardados();
}

// --- MODO PLAYGROUND LIBRE ---

function activarPlaygroundLibre() {
  nivelActual = null;
  currentRepo = null;

  document.getElementById('playground-title').textContent = "Práctica Libre (Consola)";
  expectedLevelOutputEl.textContent = "Modo practica libre. Escribe y ejecuta lo que quieras.";
  coachLevelOutputEl.textContent = "No hay limites, prueba tus propios algoritmos.";
  stepsLevelOutputEl.textContent = "1. Escribe tu logica. 2. Presiona Ejecutar. 3. Observa la salida.";
  infoLevelOutputEl.textContent = "En este modo puedes crear multiples clases y metodos para experimentar.";

  document.body.classList.add('free-practice-mode');

  setEditorHint("Modo <strong>Práctica Libre</strong> activado.");

  // Opcional: limpiar el editor con un template basico
  editorEl.value = 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Practica POO libremente...");\n    }\n}';
  updateLineNumbers();
  renderHighlight();
  syncLineScroll();

  document.querySelector('#target-playground').scrollIntoView({ behavior: 'smooth' });
}
window.activarPlaygroundLibre = activarPlaygroundLibre;

// Inicialización
cargarRepositoriosGuardados();
renderRetos(); // Carga inicial de retos standard

// --- CENTRO DE REFERENCIA ---
let datosReferencia = [];

async function cargarReferencia() {
  try {
    const res = await fetch('/referencia.json');
    const data = await res.json();
    datosReferencia = data.temas;
    renderReferencia(datosReferencia);
  } catch (err) {
    console.error('Error cargando referencia:', err);
  }
}

function renderReferencia(temas) {
  const grid = document.getElementById('referenciaGrid');
  if (!grid) return;

  grid.innerHTML = temas.map(t => `
    <article class="level-card">
      <div>
        <h4 style="margin: 0; color: var(--brand);">${t.titulo}</h4>
        <p style="font-size: 0.85rem; margin: 10px 0;">${t.resumen}</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
        <button class="action" style="padding: 5px 12px; font-size: 0.75rem;" 
          onclick="verDetalleReferencia('${t.id}')">Ver Codigo</button>
        <a href="${t.link}" target="_blank" class="status-pill" style="text-decoration: none; color: inherit; font-size: 0.7rem;">Doc Oficial</a>
      </div>
    </article>
  `).join('');
}

function filtrarReferencia() {
  const query = document.getElementById('refSearch').value.toLowerCase();
  const filtrados = datosReferencia.filter(t =>
    t.titulo.toLowerCase().includes(query) ||
    t.resumen.toLowerCase().includes(query)
  );
  renderReferencia(filtrados);
}
window.filtrarReferencia = filtrarReferencia;

function verDetalleReferencia(id) {
  const tema = datosReferencia.find(t => t.id === id);
  if (!tema) return;

  const modal = document.getElementById('codeModal');
  const modalCode = document.getElementById('modalCode');
  if (!modal || !modalCode) return;

  modalCode.textContent = tema.ejemplo;
  modal.classList.add('active');
}
window.verDetalleReferencia = verDetalleReferencia;

// Inicializacion de Referencia
cargarReferencia();
// --- GESTIÓN DE TEMAS (THEME SWITCHER) ---
function toggleThemeModal() {
  themeModal.classList.toggle('active');
}

function applyTheme(themeName) {
  // Limpiar clases previas
  document.body.classList.remove('theme-dark', 'theme-midnight', 'theme-earth');

  // Agregar nueva si no es esmeralda (default)
  if (themeName !== 'emerald') {
    document.body.classList.add(`theme-${themeName}`);
  }

  // Actualizar UI del modal
  themeCards.forEach(card => {
    card.classList.toggle('active', card.dataset.theme === themeName);
  });

  // Guardar preferencia
  localStorage.setItem('javaDashboardTheme', themeName);
}

// Event Listeners Temas
if (btnConfig) btnConfig.onclick = toggleThemeModal;
if (closeThemeModal) closeThemeModal.onclick = toggleThemeModal;

themeCards.forEach(card => {
  card.onclick = () => {
    applyTheme(card.dataset.theme);
    // Cerrar modal tras seleccion tras breve delay para feedback visual
    setTimeout(toggleThemeModal, 300);
  };
});

// Cargar tema guardado al inicio
const savedTheme = localStorage.getItem('javaDashboardTheme') || 'emerald';
applyTheme(savedTheme);

// Cerrar modal de temas al hacer click fuera
window.addEventListener('click', (e) => {
  if (e.target === themeModal) toggleThemeModal();
});

// --- SMART CONTEXT MENU LOGIC ---

editorEl.addEventListener('contextmenu', (e) => {
  // Solo activar si estamos dentro del área del editor
  if (e.target !== editorEl) return;

  e.preventDefault();

  const mouseX = e.clientX;
  const mouseY = e.clientY;

  // Posicionar menú
  editorContextMenu.style.left = `${mouseX}px`;
  editorContextMenu.style.top = `${mouseY}px`;
  editorContextMenu.classList.add('active');

  // Cerrar al hacer click fuera
  const closeMenu = () => {
    editorContextMenu.classList.remove('active');
    document.removeEventListener('click', closeMenu);
  };
  setTimeout(() => document.addEventListener('click', closeMenu), 10);
});

function parseClassFields() {
  const code = editorEl.value;
  // Regex para detectar campos: (private|protected) [Tipo] [nombre];
  const fieldRegex = /(?:private|protected)\s+([A-Za-z0-9_<>?]+)\s+([A-Za-z0-9_]+)\s*;/g;
  let matches;
  const fields = [];

  while ((matches = fieldRegex.exec(code)) !== null) {
    fields.push({ type: matches[1], name: matches[2] });
  }
  return fields;
}

function insertGettersSetters() {
  const fields = parseClassFields();
  if (fields.length === 0) {
    alert("No se encontraron campos privados/protegidos para generar métodos. Asegúrate de declarar tus campos así: private String miVariable;");
    return;
  }

  let generatedCode = "\n";
  fields.forEach(f => {
    const capitalized = f.name.charAt(0).toUpperCase() + f.name.slice(1);
    // Getter
    generatedCode += `    public ${f.type} get${capitalized}() {\n        return this.${f.name};\n    }\n\n`;
    // Setter
    generatedCode += `    public void set${capitalized}(${f.type} ${f.name}) {\n        this.${f.name} = ${f.name};\n    }\n\n`;
  });

  injectCodeAtCursor(generatedCode);
}

function insertConstructor() {
  const fields = parseClassFields();
  // Intentar encontrar el nombre de la clase
  const classMatch = editorEl.value.match(/public\s+class\s+([A-Za-z0-9_]+)/);
  const className = classMatch ? classMatch[1] : "MiClase";

  let params = fields.map(f => `${f.type} ${f.name}`).join(", ");
  let body = fields.map(f => `        this.${f.name} = ${f.name};`).join("\n");

  let generatedCode = `\n    public ${className}(${params}) {\n${body}\n    }\n`;

  injectCodeAtCursor(generatedCode);
}

function insertBoilerplate(type) {
  let code = "";
  const className = "ClaseDemo";

  switch (type) {
    case 'controller':
      code = `import org.springframework.stereotype.Controller;\nimport org.springframework.web.bind.annotation.*;\n\n@Controller\n@RequestMapping("/${className.toLowerCase()}")\npublic class ${className}Controller {\n\n    @GetMapping\n    public String index() {\n        return "index";\n    }\n}`;
      break;
    case 'rest-controller':
      code = `import org.springframework.web.bind.annotation.*;\nimport org.springframework.http.ResponseEntity;\n\n@RestController\n@RequestMapping("/api/${className.toLowerCase()}")\npublic class ${className}Controller {\n\n    @GetMapping\n    public ResponseEntity<?> getAll() {\n        return ResponseEntity.ok().build();\n    }\n}`;
      break;
    case 'entity':
      code = `import javax.persistence.*;\n\n@Entity\n@Table(name = "${className.toLowerCase()}s")\npublic class ${className} {\n\n    @Id\n    @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n\n}`;
      break;
  }

  editorEl.value = code;
  updateLineNumbers();
  renderHighlight();
}

function injectCodeAtCursor(newCode) {
  const start = editorEl.selectionStart;
  const end = editorEl.selectionEnd;
  const text = editorEl.value;

  editorEl.value = text.substring(0, start) + newCode + text.substring(end);

  updateLineNumbers();
  renderHighlight();
}

// Globalizar funciones para onclick en HTML
window.insertGettersSetters = insertGettersSetters;
window.insertConstructor = insertConstructor;
window.insertBoilerplate = insertBoilerplate;
