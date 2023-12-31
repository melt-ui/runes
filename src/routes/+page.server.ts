import fs from "node:fs/promises";
import type { PageServerLoad } from "./$types";

const filePattern = /\.(svelte|ts)$/;

export const load: PageServerLoad = async () => {
	const dirs = await fs.readdir("src/routes/playground");
	return {
		routes: dirs.filter((s) => !filePattern.test(s)),
	};
};
