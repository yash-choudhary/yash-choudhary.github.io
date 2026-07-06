import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// base is "/" because this deploys to the user site repo
// (yash-choudhary.github.io). If you ever deploy to a project repo
// instead, change base to "/<repo-name>/".
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
});
