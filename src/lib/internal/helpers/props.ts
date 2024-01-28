export function createMergeProps<Defaults extends object>(defaults: Defaults) {
	return <T>(props: T) => {
		return { ...defaults, ...props } as Defaults & T;
	};
}
