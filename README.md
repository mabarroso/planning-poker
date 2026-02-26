# Planning Poker Web App

Una aplicación web de Planning Poker para equipos de desarrollo que permite realizar estimaciones de tareas en tiempo real de forma sencilla y eficiente.

## Características

- **Sincronización en Tiempo Real:** Comunicación fluida entre todos los programadores mediante WebSockets (Socket.io).
- **Gestión de Moderador:** El primer usuario en conectarse es designado automáticamente como moderador.
- **Configuración Dinámica:** El moderador puede personalizar los valores de las cartas disponibles.
- **Interfaz Intuitiva:** Diseño limpio y moderno con visualización de participantes y estados de votación.
- **Cálculo de Media:** Revelación automática de cartas y cálculo de la media aritmética de los votos numéricos.

## Tecnologías Utilizadas

- **Backend:** Node.js, Express.
- **Tiempo Real:** Socket.io.
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla).

## Requisitos Previos

- [Node.js](https://nodejs.org/) (versión 14 o superior recomendada)
- npm (incluido con Node.js)

## Instalación y Ejecución

1. Clona el repositorio o descarga los archivos.
2. Abre una terminal en el directorio raíz del proyecto.
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Inicia el servidor:
   ```bash
   node index.js
   ```
5. Abre tu navegador y accede a `http://localhost:3000`.

## Instrucciones de Uso

1. **Unirse:** Introduce tu nombre para entrar a la sala.
2. **Moderación:** Si eres el primero, verás los controles para configurar las cartas e iniciar la sesión.
3. **Planificación:** Pulsa "Iniciar Planificación" para que todos los usuarios puedan votar.
4. **Votación:** Cada programador selecciona una carta. Las cartas permanecen boca abajo hasta que todos hayan votado.
5. **Revelación:** Una vez completada la votación, las cartas se muestran a todos y se calcula la media automáticamente.
6. **Reinicio:** El moderador puede reiniciar la sesión para una nueva tarea en cualquier momento.
