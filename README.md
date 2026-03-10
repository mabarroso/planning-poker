# Planning Poker Web App

A web-based Planning Poker application for development teams that allows task estimation in real time in a simple and efficient way.

## Main Features

* **Real-Time Synchronization:** Instant communication between all team members using WebSockets with Socket.io.
* **Moderator Role:** The first user to join takes control and can configure the cards and start/reset estimation sessions.
* **Spectator Role:** Users can choose to join as spectators to observe the process and view the results without participating in the voting. Spectators appear in a separate list and do not take up space at the card table.
* **Customizable Card Configuration:** The moderator can define the set of card values (default: 1, 2, 4, 6, 8, 12, 14, ?, ∞).
* **Visual Status Indicators:** Clear identification of who has voted and who still has a pending vote through status labels.
* **Voting Privacy:** Each user can see their own selected card, while their teammates’ cards remain face down until the end.
* **Automatic Reveal:** Cards are automatically revealed for all participants once the last developer submits their vote.
* **Advanced Statistics:** After the reveal, the arithmetic mean, maximum value, minimum value, and mode (most frequent value) are automatically calculated.
* **Automatic Average Calculation:** (Included as part of the advanced statistics mentioned above).

## Technologies Used

* **Server:** Node.js with Express.
* **Real-Time Communication:** Socket.io.
* **User Interface:** HTML5, CSS3 (modern and responsive), and JavaScript (Vanilla).

## Requirements

* [Node.js](https://nodejs.org/) (v14 or higher)
* npm (Node package manager)

## Installation and Setup

1. **Clone the project:**

   ```bash
   git clone <repository-url>
   cd planning-poker
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the application:**

   ```bash
   npm start
   # or directly
   node index.js
   ```

4. **Access:**
   Open your browser at `http://localhost:3000`.

## Usage Guide

1. **Entry:** Each participant enters their name when accessing the application.
2. **Setup (Moderator):** The moderator adjusts the card values if necessary and clicks **"Start Planning"**.
3. **Voting:** Participants choose a card from the selector at the bottom.

   * Your card will appear in blue (face up) for confirmation.
   * You will see others’ cards in gray with a `?` (face down).
   * The status will change from **Pending** to **Voted**.
4. **Results:** When everyone has voted, the cards automatically flip for all participants and the statistics are displayed (average, maximum, minimum, and mode).
5. **Next Task:** The moderator clicks **"Reset"** or **"Start Planning"** to clear the table and begin a new estimation.
