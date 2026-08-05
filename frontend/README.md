# Frontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.1.5.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

Descripción
Este proyecto consiste en un motor de generación programática de secuencias y patrones MIDI expuesto a través de una API REST. Su objetivo principal es permitir la creación, manipulación y exportación de archivos o flujos MIDI (enfocados en bases rítmicas, secuencias elcetrónicas, etc.) para su posterior consumo o integración en DAWs y otras plataformas.
Interfaz de Usuario (UI)
La aplicación cuenta con una interfaz web moderna, limpia y diseñada en modo oscuro para integrarse de forma natural en el flujo de trabajo de cualquier productor musical. El dashboard principal está estructurado en tres áreas clave:

![alt text](image.png)

1. Creador de Patrones (Create New Pattern)
El panel izquierdo actúa como el motor de generación. Aquí el usuario define los parámetros creativos antes de generar la secuencia:

Configuración inicial: Asignación de nombre al patrón y control deslizante para ajustar el tempo (BPM).
Parámetros musicales: Selección de longitud (compases), escala musical, tono (Key) y estilo de patrón base (ej. Techno Bassline).
Acción principal: Un botón destacado de Generate Pattern que procesa los parámetros y crea una nueva secuencia MIDI.

2. Visualizador de Patrones (Pattern Visualizer)
El área central ofrece retroalimentación visual e interactiva inmediata:

Secuenciador por pasos (Grid): Una cuadrícula tipo Piano Roll de 16 pasos que muestra exactamente qué notas se disparan y en qué octava.
Controles de transporte: Botones integrados de Play y Stop, junto con un ajuste rápido de BPM, para preescuchar la secuencia generada directamente en el navegador sin necesidad de exportarla primero.

3. Mi Biblioteca (My Library)
El panel derecho está destinado a la gestión de los proyectos y secuencias guardadas por el usuario:

Historial de secuencias: Listado de los patrones previamente generados (ej. Ambient Synth, EDM sequence), mostrando de un vistazo su BPM y duración.
Acciones rápidas: Cada elemento de la lista incluye botones para reproducir la preescucha, editar los parámetros o exportar/descargar el archivo MIDI final para arrastrarlo a Ableton Live u otro DAW.

El núcleo del sistema está diseñado bajo estándares estrictos de ingeniería de software para garantizar su mantenibilidad, escalabilidad y aislamiento de dependencias tecnológicas.
Arquitectura y Stack Tecnológico
El proyecto se rige por un diseño agnóstico al framework utilizando Arquitectura Hexagonal (Ports and Adapters) y Domain-Driven Design (DDD).

Lenguaje: Java 21 (Uso intensivo de Records, Pattern Matching, etc.).
Framework de Infraestructura: Spring Boot 3.x.
Metodologías: SOLID, Test-Driven Development (TDD/DDT).
Gestión de Dependencias: Maven / Gradle.
DevOps / CI-CD: Git & GitLab (Pipelines de integración continua).

Estructura de Capas (Hexagonal)

Domain (domain): El núcleo puro. Contiene las entidades de negocio (ej. MidiPattern), Value Objects y excepciones propias. Regla estricta: Cero dependencias de Spring o frameworks externos.
Application (application): Orquesta los casos de uso (UseCases) y define los puertos de entrada (in) y salida (out).
Infrastructure (infrastructure): Contiene los adaptadores técnicos. Aquí vive Spring Boot, los Controladores REST (adapter.in.web), la persistencia y la generación física de ficheros MIDI (adapter.out.file).

Directrices para los Equipos
Backend (Motor y API)

Lenguaje: Java 21
Framework: Spring Boot 3
Arquitectura: Hexagonal (Puertos y Adaptadores) para mantener el dominio del generador MIDI completamente aislado de las dependencias de infraestructura y frameworks.
Testing: JUnit 5 y Mockito para pruebas unitarias de los casos de uso y MockMvc para la capa web.
Patrones: Manejo global de excepciones (@RestControllerAdvice), DTOs estructurados mediante Records de Java y principios SOLID.

Frontend (Interfaz de Usuario)

Framework: [React / Vue / Angular]
Estilos: Diseño a medida con enfoque Dark Mode orientado a herramientas musicales usando [Tailwind CSS / SASS / CSS puro].
Audio y Reproducción: Integración con Tone.js para el motor de audio y la programación temporal (scheduling). Esto permite la síntesis de sonido en tiempo real y la preescucha precisa del secuenciador directamente en el navegador.
Integración MIDI: Uso de la Web MIDI API nativa (y utilidades como @tonejs/midi) para la gestión, parseo y exportación de secuencias a archivos .mid estándar, listos para ser importados en cualquier DAW (Ableton Live, FL Studio, Logic, etc.).

Equipo de PHP / Integración de Servicios
Si el ecosistema crece hacia una arquitectura de microservicios o requiere interoperabilidad con plataformas externas construidas en PHP, este core servirá como sistema independiente. La comunicación se realizará exclusivamente a través de la API REST (JSON). Los contratos de la API estarán documentados y versionados (ej. /api/v1/patterns) para garantizar que la integración desde clientes PHP sea predecible y robusta.
