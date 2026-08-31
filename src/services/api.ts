import axios from "axios";

export const api = axios.create({
	baseURL: "https://saint-scale-api-1.onrender.com/api",
	headers: {
		"Content-Type": "application/json",
	},
});
