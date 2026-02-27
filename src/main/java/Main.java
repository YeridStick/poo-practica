public class Main {

    public static void main(String[] args) {
        BuclesPractica bucles = new BuclesPractica();
        MapPractica mapas = new MapPractica();
        AbstraccionPractica poo = new AbstraccionPractica();
        ScopeInstanciasPractica scope = new ScopeInstanciasPractica("Primer objeto");
        PooBasesEjercicios pooBases = new PooBasesEjercicios();
        PooDiaADiaPractica pooDiaADia = new PooDiaADiaPractica();
        PatronesDisenoPractica patrones = new PatronesDisenoPractica();
        ProgramacionFuncionalPractica funcional = new ProgramacionFuncionalPractica();
        ColeccionesAvanzadasPractica colecciones = new ColeccionesAvanzadasPractica();

        // Bucles (antes -> ahora)
        // ... (resto silenciado)

        // Interfaces + abstracta + implementaciones
        poo.demoNotificaciones();
        // poo.demoFactoryNotificador();

        // Patrones de diseno
        patrones.demoStrategyPago();
        patrones.demoObserverStock();
        patrones.demoPatronesAvanzados();
        // patrones.ejerciciosPatrones();

        // Programacion funcional
        // funcional.demoFuncional();
        // funcional.ejerciciosFuncionales();

        // Colecciones avanzadas
        colecciones.demoColecciones();
        colecciones.ejerciciosAvanzados();
    }
}
