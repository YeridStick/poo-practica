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

// Monaco Editor Initialization
let monacoEditor;
const editorContainer = document.getElementById('monacoEditor');
const oldTextarea = document.getElementById('javaEditor');
const editorEl = oldTextarea;

require.config({ paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });
require(['vs/editor/editor.main'], function () {
    monacoEditor = monaco.editor.create(editorContainer, {
        value: oldTextarea.value || 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hola desde plataforma de aprendizaje Dashboard");\n    }\n}',
        language: 'java',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 14,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 10, bottom: 10 },
        roundedSelection: true
    });

    // Sincronizar con el estado de archivos
    monacoEditor.onDidChangeModelContent(() => {
        files[activeFile] = monacoEditor.getValue();
        updateLineNumbers();
    });

    // Eventos de teclado y otros delegados a Monaco
    monacoEditor.onKeyDown((e) => {
        if (e.keyCode === monaco.KeyCode.Tab) {
            if (tryAutoExpandFromToken()) {
                e.preventDefault();
                e.stopPropagation();
            }
        }
        if (e.ctrlKey && e.keyCode === monaco.KeyCode.Enter) {
            e.preventDefault();
            e.stopPropagation();
            ejecutarJava();
        }
    });

    monacoEditor.onMouseDown(() => renderSnippetSuggestions());
    monacoEditor.onDidScrollChange(() => {
        // syncLineScroll ya no es necesario
    });

    // Dot completion for Monaco
    monacoEditor.onKeyUp((e) => {
        if (e.browserEvent.key === '.') {
            handleDotCompletion();
        } else if (e.keyCode === monaco.KeyCode.Escape || e.keyCode === monaco.KeyCode.Enter) {
            suggestionBox.classList.remove('active');
        }
    });
});

// Helper para obtener/establecer valor del editor (abstracción)
function getEditorValue() {
    return monacoEditor ? monacoEditor.getValue() : oldTextarea.value;
}

function setEditorValue(val) {
    if (monacoEditor) {
        monacoEditor.setValue(val);
    } else {
        oldTextarea.value = val;
    }
}

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

// Custom Modals Elements
const inputModal = document.getElementById('inputModal');
const customInput = document.getElementById('customInput');
const inputModalConfirm = document.getElementById('inputModalConfirm');
const alertModal = document.getElementById('alertModal');
const alertModalMessage = document.getElementById('alertModalMessage');
const alertModalConfirm = document.getElementById('alertModalConfirm');
const alertModalCancel = document.getElementById('alertModalCancel');
const alertModalTitle = document.getElementById('alertModalTitle');
const inputModalTitle = document.getElementById('inputModalTitle');

function showCustomPrompt(title, placeholder, onConfirm) {
  inputModalTitle.textContent = title;
  customInput.placeholder = placeholder;
  customInput.value = '';
  inputModal.classList.add('active');
  customInput.focus();

  const handleConfirm = () => {
    const val = customInput.value;
    if (val) {
      onConfirm(val);
      closeInputModal();
    }
  };

  inputModalConfirm.onclick = handleConfirm;
  customInput.onkeyup = (e) => { if (e.key === 'Enter') handleConfirm(); };
}

function closeInputModal() {
  inputModal.classList.remove('active');
}

function showCustomAlert(title, message, onConfirm, showCancel = false) {
  alertModalTitle.textContent = title;
  alertModalMessage.textContent = message;
  alertModalCancel.style.display = showCancel ? 'block' : 'none';
  alertModal.classList.add('active');

  alertModalConfirm.onclick = () => {
    closeAlertModal();
    if (onConfirm) onConfirm();
  };
}

function closeAlertModal() {
  alertModal.classList.remove('active');
}

window.closeInputModal = closeInputModal;
window.closeAlertModal = closeAlertModal;

// Multi-file State
let files = {
  "Main.java": `public class Main {
    public static void main(String[] args) {
        System.out.println("Hola desde plataforma de aprendizaje Dashboard");
    }
}`
};
let activeFile = "Main.java";

function setEditorHint(text) {
  editorHint.innerHTML = text;
}

function updateExpandButtons(isFull) {
  const txt = isFull ? 'Reducir' : 'Ampliar';
  if (btnExpandEditor) btnExpandEditor.textContent = txt;
  if (btnExpandEditorTop) btnExpandEditorTop.textContent = isFull ? 'Salir' : 'Pantalla completa';
}

let originalParent = null;
let editorPlaceholder = null;

function renderTabs() {
  tabContainer.innerHTML = '';
  Object.keys(files).forEach(fileName => {
    const tab = document.createElement('div');
    tab.className = `tab ${fileName === activeFile ? 'active' : ''}`;
    tab.innerHTML = `
      <span>${fileName}</span>
      ${fileName !== 'Main.java' ? `<span class="close-tab" onclick="event.stopPropagation(); removeFile('${fileName}')">×</span>` : ''}
    `;
    tab.onclick = () => switchTab(fileName);
    tabContainer.appendChild(tab);
  });
}

function switchTab(fileName) {
  // Guardar contenido actual
  files[activeFile] = getEditorValue();

  activeFile = fileName;
  setEditorValue(files[fileName]);

  renderTabs();
  updateLineNumbers();
}

function createNewFile() {
  showCustomPrompt("Nuevo Archivo", "Nombre del archivo (ej: Persona.java)", (name) => {
    if (!name.endsWith('.java')) {
      showCustomAlert("Error", "El archivo debe terminar en .java");
      return;
    }
    if (files[name]) {
      showCustomAlert("Error", "El archivo ya existe");
      return;
    }

    const className = name.replace('.java', '');
    files[name] = `public class ${className} {\n    \n}`;
    switchTab(name);
  });
}

function removeFile(fileName) {
  if (fileName === 'Main.java') return;
  showCustomAlert("Confirmar", `¿Eliminar ${fileName}?`, () => {
    delete files[fileName];
    if (activeFile === fileName) {
      switchTab('Main.java');
    } else {
      renderTabs();
    }
  }, true);
}

// Inicializar pestañas
renderTabs();

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
    if (monacoEditor) {
        monacoEditor.layout();
        monacoEditor.focus();
    }
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
  if (!monacoEditor) return;
  const model = monacoEditor.getModel();
  const startPos = model.getPositionAt(start);
  const endPos = model.getPositionAt(end);
  const range = new monaco.Range(startPos.lineNumber, startPos.column, endPos.lineNumber, endPos.column);
  
  monacoEditor.executeEdits("my-source", [
    { range: range, text: replacement, forceMoveMarkers: true }
  ]);
  
  const newPos = model.getPositionAt(caretPos);
  monacoEditor.setPosition(newPos);
  monacoEditor.focus();
}

// Monaco maneja su propio scroll y resaltado

function autoResizeEditor() {
  // Desactivamos el redimensionado automático para evitar que el editor crezca indefinidamente.
  // Ahora el editor tiene una altura fija en CSS con scroll interno.
}

function updateLineNumbers() {
  const lines = getEditorValue().split('\n').length;
  let out = '';
  for (let i = 1; i <= lines; i++) {
    out += i + '\n';
  }
  lineNumbersEl.textContent = out;
  autoResizeEditor();
}

function syncLineScroll() {
  // Monaco maneja su propio scroll
}

// Eventos manejados por Monaco o delegados


function getWordBounds() {
  if (!monacoEditor) return null;
  const position = monacoEditor.getPosition();
  const model = monacoEditor.getModel();
  const word = model.getWordAtPosition(position);
  if (!word) return { wordStart: model.getOffsetAt(position), wordEnd: model.getOffsetAt(position), token: '', fullToken: '' };
  
  return {
    wordStart: model.getOffsetAt({ lineNumber: position.lineNumber, column: word.startColumn }),
    wordEnd: model.getOffsetAt({ lineNumber: position.lineNumber, column: word.endColumn }),
    token: word.word.substring(0, position.column - word.startColumn),
    fullToken: word.word
  };
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
      if (monacoEditor) monacoEditor.focus();
    });
  });
  setEditorHint('Sugerencias: pulsa chip o <span class="kbd">Tab</span>/<span class="kbd">Espacio</span> para expandir');
}

function indentSelection() {
  if (!monacoEditor) return;
  monacoEditor.trigger('keyboard', 'tab', {});
}

function outdentSelection() {
  if (!monacoEditor) return;
  monacoEditor.trigger('keyboard', 'outdent', {});
}

function insertNewLineWithIndent() {
  if (!monacoEditor) return;
  monacoEditor.trigger('keyboard', 'type', { text: "\n" });
}

// Eventos de teclado y otros delegados a Monaco (Movidos al require block)

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
        <p style="font-size: 0.75rem; margin: 10px 0; opacity: 0.7;">
          ${cfg.expected && cfg.expected.length
        ? `Salida esperada: ${cfg.expected.map(t => `<code style="background:rgba(0,0,0,0.1);padding:1px 5px;border-radius:4px;">${t}</code>`).join(', ')}`
        : ''}
        </p>
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
  getEditorValue() = cfg.template;
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
    // Guardar fecha de la primera completacion de hoy
    const todayKey = `poo_done_day_${new Date().toISOString().slice(0, 10)}`;
    const dayCount = parseInt(localStorage.getItem(todayKey) || '0') + 1;
    localStorage.setItem(todayKey, dayCount);
    setEditorHint('Nivel completado! Buen trabajo.');
    renderRetos();
    updateDailyProgress();
  } else {
    setEditorHint('La salida no coincide o esta vacia. Sigue intentando!');
  }
}
window.validarNivelRepo = validarNivelRepo;

function cargarEjercicioNivel(id) {
  const cfg = niveles[id];
  if (!cfg) return;
  nivelActual = id;
  getEditorValue() = cfg.template;
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
    // Registrar completacion del dia
    const todayKey = `poo_done_day_${new Date().toISOString().slice(0, 10)}`;
    localStorage.setItem(todayKey, parseInt(localStorage.getItem(todayKey) || '0') + 1);
    setEditorHint('Nivel completado. Ya puedes avanzar al siguiente.');
    updateDailyProgress();
  } else {
    if (status && status.textContent !== 'Completado') {
      status.textContent = 'Aun no pasa';
      status.className = 'level-status pending';
    }
    setEditorHint('La salida no coincide. Revisa la prueba esperada.');
  }
}
window.validarNivel = validarNivel;

// =====================
// PROGRESO DIARIO ENGINE
// =====================
function updateDailyProgress() {
  const DAILY_GOAL = 2;
  const today = new Date().toISOString().slice(0, 10);
  const todayKey = `poo_done_day_${today}`;
  const doneToday = parseInt(localStorage.getItem(todayKey) || '0');

  // Calcular racha de dias consecutivos
  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const dateStr = checkDate.toISOString().slice(0, 10);
    const dayDone = parseInt(localStorage.getItem(`poo_done_day_${dateStr}`) || '0');
    if (dayDone > 0) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else { break; }
  }

  const pct = Math.min(100, Math.round((doneToday / DAILY_GOAL) * 100));

  const msgs = [
    { min: DAILY_GOAL, msg: '¡Meta cumplida! ¡Sigue así crack! 🏆' },
    { min: 1, msg: '¡Vas por buen camino! 💪' },
    { min: 0, msg: '¡Hoy es un buen día para aprender! 🚀' },
  ];
  const msg = msgs.find(m => doneToday >= m.min)?.msg || '';

  const barEl = document.getElementById('dailyProgressBar');
  const doneEl = document.getElementById('dailyDone');
  const goalEl = document.getElementById('dailyGoal');
  const descEl = document.getElementById('dailyGoalDesc');
  const streakEl = document.getElementById('streakCount');
  const motivEl = document.getElementById('dailyMotivation');

  if (!barEl) return;
  barEl.style.width = pct + '%';
  doneEl.textContent = doneToday;
  goalEl.textContent = DAILY_GOAL;
  streakEl.textContent = streak;
  descEl.textContent = doneToday >= DAILY_GOAL
    ? '¡Meta completada! Puedes seguir practicando.'
    : `Completa ${DAILY_GOAL - doneToday} reto${DAILY_GOAL - doneToday !== 1 ? 's' : ''} más para tu meta de hoy.`;
  if (motivEl) motivEl.textContent = msg;
}

window.updateDailyProgress = updateDailyProgress;
updateDailyProgress(); // Inicializar al cargar la pagina

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
  getEditorValue() = templates[tipo] || templates.hola;
  editorEl.focus();
  updateLineNumbers();
  renderHighlight();
  syncLineScroll();
  renderSnippetSuggestions();
  setEditorHint('Plantilla cargada. Usa snippets: <strong>soup</strong>, <strong>soutv</strong>, <strong>fori</strong>, <strong>main</strong>.');
}
window.cargarPlantilla = cargarPlantilla;

function withAutoImports(source) {
  let code = source || '';
  const hasImports = /import\s+java\./.test(code);

  // Detectar uso de colecciones comunes
  const needsUtil =
    /\bList\b/.test(code) ||
    /\bMap\b/.test(code) ||
    /\bSet\b/.test(code) ||
    /\bArrays\b/.test(code);

  const lines = code.split('\n');
  let insertIndex = 0;

  // Saltar comentarios de cabecera y líneas en blanco
  while (insertIndex < lines.length && /^\s*(\/\*|\/\/|$)/.test(lines[insertIndex])) {
    insertIndex++;
  }

  const importsToAdd = [];
  if (needsUtil && !/import\s+java\.util\./.test(code)) {
    importsToAdd.push('import java.util.*;');
  }

  if (!importsToAdd.length) return code;

  const before = lines.slice(0, insertIndex);
  const after = lines.slice(insertIndex);
  return [...before, ...importsToAdd, '', ...after].join('\n');
}

async function ejecutarJava() {
  const currentCode = getEditorValue();
  const out = document.getElementById('runOutput');
  out.textContent = "Ejecutando...";
  try {
    const codeWithImports = withAutoImports(currentCode);
    if (codeWithImports !== currentCode) {
      setEditorValue(codeWithImports);
      updateLineNumbers();
    }
    const res = await fetch('/run-java', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain; charset=UTF-8' },
      body: codeWithImports
    });
    const text = await res.text();
    out.textContent = text;
  } catch (err) {
    out.textContent = "Error llamando al backend: " + err;
  }
}
window.ejecutarJava = ejecutarJava;

function descargarEjercicio() {
  const code = getEditorValue() || '';
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
      const expectedTokens = ej.output_esperado || ej.expected || null;
      nuevosNiveles[`nivel_${idx + 1}`] = {
        order: idx + 1,
        titulo: ej.titulo,
        descripcion: ej.descripcion,
        template: ej.template,
        expected: expectedTokens,
        expectedText: expectedTokens
          ? `Salida esperada: la consola debe contener → ${expectedTokens.map(t => `"${t}"`).join(', ')}`
          : ej.descripcion || ''
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
  setEditorValue('public class Main {\n    public static void main(String[] args) {\n        System.out.println("Practica POO libremente...");\n    }\n}');
  updateLineNumbers();
  // renderHighlight(); // Monaco ya lo hace
  // syncLineScroll(); // Monaco ya lo hace

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

// Sincronizar archivos con el editor
// El listener input original ya no es necesario o se maneja vía onDidChangeModelContent
/*
editorEl.addEventListener('input', () => {
  files[activeFile] = getEditorValue();
  updateLineNumbers();
});
*/

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
  const code = getEditorValue();
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
    showCustomAlert("Info", "No se encontraron campos privados/protegidos para generar métodos. Asegúrate de declarar tus campos así: private String miVariable;");
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
  const code = getEditorValue();
  const pos = editorEl.selectionStart;

  // Buscar hacia atrás desde el cursor la palabra 'class' para el nombre
  const beforeCursor = code.substring(0, pos);
  const classMatches = [...beforeCursor.matchAll(/class\s+([A-Za-z0-9_]+)/g)];
  const className = classMatches.length > 0 ? classMatches[classMatches.length - 1][1] : "MiClase";

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

  setEditorValue(code);
  updateLineNumbers();
  // renderHighlight(); // Monaco ya lo hace
}

function injectCodeAtCursor(newCode) {
  if (!monacoEditor) return;
  const selection = monacoEditor.getSelection();
  const range = new monaco.Range(selection.startLineNumber, selection.startColumn, selection.endLineNumber, selection.endColumn);
  
  monacoEditor.executeEdits("my-source", [
    { range: range, text: newCode, forceMoveMarkers: true }
  ]);
  monacoEditor.focus();
  updateLineNumbers();
}

// Globalizar funciones para onclick en HTML
window.insertGettersSetters = insertGettersSetters;
window.insertConstructor = insertConstructor;
window.insertBoilerplate = insertBoilerplate;
window.createNewFile = createNewFile;
window.removeFile = removeFile;

// --- DOT COMPLETION ENGINE ---

// El listener keyup original ya no es necesario o se maneja vía monaco
/*
editorEl.addEventListener('keyup', (e) => {
  if (e.key === '.') {
    handleDotCompletion(e);
  } else if (e.key === 'Escape' || e.key === 'Enter') {
    suggestionBox.classList.remove('active');
  }
});
*/

function handleDotCompletion() {
  const text = getEditorValue();
  if (!monacoEditor) return;
  
  const position = monacoEditor.getPosition();
  const model = monacoEditor.getModel();
  const lineContent = model.getLineContent(position.lineNumber);
  const beforeDot = lineContent.substring(0, position.column - 1);

  // Encontrar el nombre de la variable antes del punto (ej: persona. )
  const varMatch = beforeDot.match(/([a-zA-Z0-9_]+)\s*$/);
  if (!varMatch) return;

  const varName = varMatch[1];

  // Encontrar el tipo de la variable en el código (ej: Persona persona; o persona = new Persona())
  const typeRegex = new RegExp(`(?:([A-Za-z0-9_<>?]+)\\s+${varName})|(?:${varName}\\s+=\\s+new\\s+([A-Za-z0-9_]+))`);
  const typeMatch = text.match(typeRegex);
  const typeName = typeMatch ? (typeMatch[1] || typeMatch[2]) : null;

  if (!typeName) return;

  // Buscar métodos en todos los archivos cargados
  const suggestions = [];
  Object.values(files).forEach(fileCode => {
    // Buscar la clase correspondiente
    const classRegex = new RegExp(`class\\s+${typeName}\\s*[^{]*\\{([\\s\\S]*?)\\}`, 'g');
    let classMatch;
    while ((classMatch = classRegex.exec(fileCode)) !== null) {
      const classBody = classMatch[1];
      // Buscar métodos públicos
      const methodRegex = /public\s+([A-Za-z0-9_<>?]+)\s+([A-Za-z0-9_]+)\s*\(/g;
      let m;
      while ((m = methodRegex.exec(classBody)) !== null) {
        suggestions.push({ name: m[2], type: m[1] });
      }
    }
  });

  if (suggestions.length > 0) {
    showSuggestions(suggestions);
  }
}

function showSuggestions(suggestions) {
  suggestionBox.innerHTML = '';
  suggestions.forEach(s => {
    const item = document.createElement('div');
    item.className = 'suggestion-item';
    item.innerHTML = `<span>${s.name}()</span> <span class="suggestion-type">${s.type}</span>`;
    item.onclick = () => {
      injectCodeAtCursor(`${s.name}()`);
      suggestionBox.classList.remove('active');
    };
    suggestionBox.appendChild(item);
  });

  if (monacoEditor) {
    const position = monacoEditor.getPosition();
    const contentPos = monacoEditor.getScrolledVisiblePosition(position);
    const rect = editorContainer.getBoundingClientRect();
    suggestionBox.style.left = `${rect.left + contentPos.left}px`;
    suggestionBox.style.top = `${rect.top + contentPos.top + 20}px`;
    suggestionBox.classList.add('active');
  }
}

// Cerrar sugerencias al hacer click fuera
window.addEventListener('click', (e) => {
  if (!suggestionBox.contains(e.target) && e.target !== editorEl) {
    suggestionBox.classList.remove('active');
  }
});
