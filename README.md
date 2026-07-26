Este proyecto consiste en un motor de generación programática de secuencias y patrones MIDI expuesto a través de una API REST. Su objetivo principal es permitir la creación, manipulación y exportación de archivos o flujos MIDI (enfocados en bases rítmicas, secuencias elcetrónicas, etc.) para su posterior consumo o integración en DAWs y otras plataformas.

El núcleo del sistema está diseñado bajo estándares estrictos de ingeniería de software para garantizar su mantenibilidad, escalabilidad y aislamiento de dependencias tecnológicas.


# Arquitectura y Stack Tecnológico

El proyecto se rige por un diseño agnóstico al framework utilizando Arquitectura Hexagonal (Ports and Adapters) y Domain-Driven Design (DDD).

Lenguaje: Java 21 (Uso intensivo de Records, Pattern Matching, etc.)

Framework de Infraestructura: Spring Boot 3.x

Metodologías: Solid, Test-Driven Development (TDD/DDT)

Gestión de Dependencias: Maven / Gradle


# Estructura de Capas (Hexagonal)

Domain (domain): El núcleo puro. Contiene las entidades de negocio (ej. MidiPattern), Value Objects y excepciones propias. Regla estricta: Cero dependencias de Spring o frameworks externos.

Application (application): Orquesta los casos de uso (UseCases) y define los puertos de entrada (in) y salida (out).

Infrastructure (infrastructure): Contiene los adaptadores técnicos. Aquí vive Spring Boot, los Controladores REST (adapter.in.web), la persistencia y la generación física de ficheros MIDI (adapter.out.file).


# Para el equipo de Backend (Java)

El desarrollo aquí exige rigor. Todo nuevo caso de uso debe definirse primero en la capa application mediante comandos e interfaces (Puertos). Los DTOs de los controladores nunca deben cruzar hacia el dominio; es obligatorio el uso de Mappers. Aprovecharemos al máximo las capacidades de Java 21, utilizando Records para asegurar la inmutabilidad en la transferencia de datos.


# Para el equipo de PHP / Integración de Servicios

Si el ecosistema crece hacia una arquitectura de microservicios o requiere interoperabilidad con plataformas externas construidas en PHP, este core servirá como sistema independiente. La comunicación se realizará exclusivamente a través de la API REST (JSON). Los contratos de la API estarán documentados y versionados (ej. /api/v1/patterns) para garantizar que la integración desde clientes PHP sea predecible y robusta.

# Para el equipo de Frontend (React / Angular / Vue)

El desarrollo del lado del cliente se realizará con la misma profesionalidad y exigencia técnica. El Frontend consumirá los endpoints expuestos por los adaptadores web de esta API. Se proveerá documentación (Swagger/OpenAPI) con contratos estrictos (Peticiones y Respuestas) para que el equipo de UI pueda mockear los datos y desarrollar componentes visuales en paralelo sin bloqueos.