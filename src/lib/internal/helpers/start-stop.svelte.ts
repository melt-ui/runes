import { tick } from "svelte";

export type StartNotifier<TValue> = (set: (value: TValue) => void) => VoidFunction;

export class StartStop<TValue> {
	#value = $state() as TValue;
	#start: StartNotifier<TValue>;

	constructor(initialValue: TValue, start: StartNotifier<TValue>) {
		this.#value = initialValue;
		this.#start = start;
	}

	#subscribers = 0;
	#stop: VoidFunction | null = null;

	get value(): TValue {
		if ($effect.active()) {
			$effect(() => {
				this.#subscribers++;
				if (this.#subscribers === 1) {
					this.#subscribe();
				}

				return () => {
					tick().then(() => {
						this.#subscribers--;
						if (this.#subscribers === 0) {
							this.#unsubscribe();
						}
					});
				};
			});
		}

		return this.#value;
	}

	#subscribe() {
		this.#stop = this.#start((value) => {
			this.#value = value;
		});
	}

	#unsubscribe() {
		if (this.#stop === null) {
			return;
		}
		this.#stop();
		this.#stop = null;
	}
}
