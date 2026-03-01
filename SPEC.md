# Project Specification: Planning Poker

## Goal
Develop a real-time **Planning Poker** web application for development teams. The tool allows developers to perform task estimations synchronously, offering a moderator role to manage the session and a spectator role to observe the process.

## Instructions
- **Roles:** The first user to join is the **Moderator**. Subsequent users are **Voters** by default, unless they select the **Spectator** option upon joining.
- **Session Flow:**
    - The moderator configures card values (default: 1, 2, 4, 6, 8, 12, 14, ?, ∞) and starts the planning.
    - Developers choose their vote; each sees their own card face up, but others' cards face down (`?`).
    - **Automatic Reveal:** As soon as the last voter casts their vote, all cards flip simultaneously.
- **Statistics:** After the reveal, the **arithmetic mean, maximum value, minimum value, and mode** of the numerical votes are automatically calculated.
- **State Management:**
    - If the room becomes empty and a new moderator joins, the voting resets automatically (waiting phase and cleared votes), but the previous card configuration is preserved.
    - The "Reset" button is large, red, and only visible to the moderator outside the waiting phase.
- **Interface:** Modern and responsive design with large buttons for easy interaction.

## Discoveries
- **Counting Logic:** The server dynamically filters the user list to ignore spectators in the "everyone has voted" calculation, allowing automatic reveal to work without waiting for them.
- **In-Memory Persistence:** The current state is volatile (lost if the Node process restarts), which is sufficient for quick estimation sessions.
- **Synchronization:** The `initData` event is used upon connection so any user joining late (or refreshing) receives the exact session state (phase, cards, role, etc.).

## Accomplished
- [x] Base architecture with **Node.js, Express, and Socket.io**.
- [x] Git repository initialized with `.gitignore`.
- [x] Role system (Moderator, Voter, Spectator).
- [x] Voting logic with privacy (see own vote).
- [x] Advanced statistics panel (Mean, Max, Min, Mode).
- [x] Separate spectator list from the card table.
- [x] Visual reinforcement in buttons and conditional visibility logic for the moderator.
- [x] Auto-reveal system and clean session reset.

## Relevant files / directories
- `index.js`: Server logic, socket management, and global room state.
- `public/`: Frontend directory.
    - `index.html`: App structure, moderator panel, table, and spectator list.
    - `script.js`: Socket.io client events, statistical calculations, and dynamic rendering.
    - `style.css`: Modern styles, statistics grid, and card design.
- `README.md`: Project documentation and usage guide.
- `.gitignore`: Configured to exclude `node_modules` and temporary files.
