# Planning Poker Web App

Una aplicación web de Planning Poker para equipos de desarrollo que permite realizar estimaciones de tareas en tiempo real de forma sencilla y eficiente.

## Características Principales

- **Sincronización en Tiempo Real:** Comunicación instantánea entre todos los miembros del equipo mediante WebSockets con Socket.io.
- **Rol de Moderador:** El primer usuario en unirse toma el control, pudiendo configurar las cartas e iniciar/reiniciar las sesiones de estimación.
- **Configuración de Cartas Personalizable:** El moderador puede definir el set de valores para las cartas (por defecto: 1, 2, 4, 6, 8, 12, 14, ?, ∞).
- **Indicadores de Estado Visuales:** Identificación clara de quién ha votado y quién tiene su voto pendiente mediante etiquetas de estado.
- **Privacidad en la Votación:** Cada usuario puede ver su propia carta seleccionada, mientras que las de sus compañeros permanecen boca abajo hasta el final.
- **Revelación y Cálculo Automático:** Cuando todos han votado, las cartas se revelan automáticamente y se calcula la media aritmética de los valores numéricos.

## Tecnologías Utilizadas

- **Servidor:** Node.js con Express.
- **Comunicación en Tiempo Real:** Socket.io.
- **Interfaz de Usuario:** HTML5, CSS3 (Moderno y Responsivo) y JavaScript (Vanilla).

## Requisitos

- [Node.js](https://nodejs.org/) (v14 o superior)
- npm (gestor de paquetes de Node)

## Instalación y Configuración

1.  **Clonar el proyecto:**
    ```bash
    git clone <url-del-repositorio>
    cd planning-poker
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Iniciar la aplicación:**
    ```bash
    npm start
    # o directamente
    node index.js
    ```

4.  **Acceder:**
    Abre tu navegador en `http://localhost:3000`.

## Guía de Uso

1.  **Entrada:** Cada participante introduce su nombre al acceder.
2.  **Preparación (Moderador):** El moderador ajusta los valores de las cartas si es necesario y pulsa **"Iniciar Planificación"**.
3.  **Votación:** Los participantes eligen una carta del selector inferior.
    - Tu carta se mostrará azul (boca arriba) para tu confirmación.
    - Verás las cartas de los demás en gris con un `?` (boca abajo).
    - El estado cambiará de **Pendiente** a **Votado**.
4.  **Resultados:** Al completar los votos, todas las cartas se giran y se muestra el promedio de la estimación.
5.  **Siguiente Tarea:** El moderador pulsa **"Reiniciar"** para limpiar la mesa y comenzar una nueva estimación.
