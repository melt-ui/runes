import fs from "node:fs/promises";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
	const dirs = await fs.readdir("src/routes/playground", { withFileTypes: true });
	return {
		routes: dirs.filter((dir) => dir.isDirectory()).map((dir) => dir.name),
	};
};
