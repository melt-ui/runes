import fs from "node:fs/promises";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const dirs = await fs.readdir("src/routes/playground");
	return {
		routes: dirs.filter((s) => !isFile(s)),
	};
};

function isFile(path: string) {
	return path.includes(".");
}
