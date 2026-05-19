import axios from "axios";

const instance = axios.create({
//   baseURL: "http://localhost:3000",
  baseURL: "https://mastercurd.vercel.app",
});
export default instance;