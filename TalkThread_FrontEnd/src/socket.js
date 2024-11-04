import { io } from "socket.io-client";

const socket = io("ws://localhost:8900"); // Initialize socket instance

export default socket; 