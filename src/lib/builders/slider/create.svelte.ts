import {
	addEventListener,
	autoDestroyEffectRoot,
	booleanAttr,
	dataMeltSelector,
	element,
	generateId,
	isHTMLElement,
	kbd,
	readableBox,
	snapValueToStep,
	styleToString,
	type HTMLElementEvent,
	type ReadableBox,
	type StyleObject,
} from "$lib/internal/helpers/index.js";
import type { SliderDirection, SliderOrientation, SliderProps } from "./types.js";

const ELEMENTS = {
	root: "slider",
	range: "slider-range",
	thumb: "slider-thumb",
	tick: "slider-tick",
} as const;

export class Slider {
	#valueBox: ReadableBox<number[]>;
	#minBox: ReadableBox<number>;
	#maxBox: ReadableBox<number>;
	#stepBox: ReadableBox<number>;
	#orientationBox: ReadableBox<SliderOrientation>;
	#dirBox: ReadableBox<SliderDirection>;
	#disabledBox: ReadableBox<boolean>;
	#rootIdBox: ReadableBox<string>;

	constructor(props: SliderProps = {}) {
		const {
			value = [],
			min = 0,
			max = 100,
			step = 1,
			orientation = "horizontal",
			dir = "ltr",
			disabled = false,
			rootId = generateId(),
		} = props;

		this.#valueBox = readableBox(value, { wrapDefaultWithState: true });
		this.#minBox = readableBox(min);
		this.#maxBox = readableBox(max);
		this.#stepBox = readableBox(step);
		this.#orientationBox = readableBox(orientation);
		this.#dirBox = readableBox(dir);
		this.#disabledBox = readableBox(disabled);
		this.#rootIdBox = readableBox(rootId);
	}

	#isActive = $state(false);
	#activeThumb = $state<{ el: HTMLElement; index: number } | null>(null);

	// States
	get value() {
		return this.#valueBox.value;
	}

	get min() {
		return this.#minBox.value;
	}

	get max() {
		return this.#maxBox.value;
	}

	get step() {
		return this.#stepBox.value;
	}

	get orientation() {
		return this.#orientationBox.value;
	}

	get dir() {
		return this.#dirBox.value;
	}

	get disabled() {
		return this.#disabledBox.value;
	}

	get rootId() {
		return this.#rootIdBox.value;
	}

	get horizontal() {
		return this.orientation === "horizontal";
	}

	get vertical() {
		return this.orientation === "vertical";
	}

	get ltr() {
		return this.dir === "ltr";
	}

	get rtl() {
		return this.dir === "rtl";
	}

	// Helpers
	#updatePosition(value: number, index: number) {
		if (this.value.length === 0) {
			this.value[index] = value;
			return;
		}

		const current = this.value[index];
		if (current === undefined || current === value) return;

		const previous = this.value[index - 1];
		if (previous !== undefined && value < current && value < previous) {
			this.#swap(value, index, previous, index - 1);
			return;
		}

		const next = this.value[index + 1];
		if (next !== undefined && value > current && value > next) {
			this.#swap(value, index, next, index + 1);
			return;
		}

		this.value[index] = snapValueToStep(value, this.min, this.max, this.step);
	}

	#swap(value: number, index: number, otherValue: number, otherIndex: number) {
		this.value[index] = otherValue;
		this.value[otherIndex] = value;

		const thumbs = this.#getAllThumbs();
		const thumb = thumbs[otherIndex];
		if (thumb === undefined) return;

		thumb.focus();
		this.#activeThumb = { el: thumb, index: otherIndex };
	}

	#getAllThumbs() {
		const root = document.getElementById(this.rootId);
		if (!root) return [];

		const thumbs = root.querySelectorAll(dataMeltSelector(ELEMENTS.thumb));
		return Array.from(thumbs).filter(isHTMLElement);
	}

	#getClosestThumb(e: PointerEvent) {
		const thumbs = this.#getAllThumbs();
		if (thumbs.length === 0) return null;

		for (const thumb of thumbs) {
			thumb.blur();
		}

		let minIndex = 0;
		let minDistance = this.#getThumbDistance(e, thumbs[0]!);
		for (let i = 1; i < thumbs.length; i++) {
			const distance = this.#getThumbDistance(e, thumbs[i]!);
			if (distance < minDistance) {
				minDistance = distance;
				minIndex = i;
			}
		}

		return {
			el: thumbs[minIndex]!,
			index: minIndex,
		};
	}

	#getThumbDistance(e: PointerEvent, thumb: HTMLElement) {
		const { left, right, top, bottom } = thumb.getBoundingClientRect();
		if (this.horizontal) {
			return Math.abs(e.clientX - (left + right) / 2);
		}
		return Math.abs(e.clientY - (top + bottom) / 2);
	}

	#getPosition(value: number) {
		return ((value - this.min) / (this.max - this.min)) * 100;
	}

	#applyPosition(clientXY: number, activeThumbIndex: number, start: number, end: number) {
		const percent = (clientXY - start) / (end - start);
		const value = percent * (this.max - this.min) + this.min;

		if (value < this.min) {
			this.#updatePosition(this.min, activeThumbIndex);
		} else if (value > this.max) {
			this.#updatePosition(this.max, activeThumbIndex);
		} else {
			const currentStep = Math.floor((value - this.min) / this.step);
			const midpointOfCurrentStep = this.min + currentStep * this.step + this.step / 2;
			const midpointOfNextStep = this.min + (currentStep + 1) * this.step + this.step / 2;
			const newValue =
				value >= midpointOfCurrentStep && value < midpointOfNextStep
					? (currentStep + 1) * this.step + this.min
					: currentStep * this.step + this.min;

			if (newValue <= this.max) {
				this.#updatePosition(newValue, activeThumbIndex);
			}
		}
	}

	// Elements
	root() {
		return element(ELEMENTS.root, {
			props: {
				id: () => this.rootId,
				dir: () => this.dir,
				disabled: () => booleanAttr(this.disabled),
				style: () => {
					return styleToString({
						position: "relative",
						"touch-action": this.disabled ? undefined : this.horizontal ? "pan-y" : "pan-x",
					});
				},
				"data-disabled": () => booleanAttr(this.disabled),
				"data-orientation": () => this.orientation,
			},
		});
	}

	range() {
		return element(ELEMENTS.range, {
			props: {
				style: () => {
					const style: StyleObject = {
						position: "absolute",
					};

					const start = this.value.length > 1 ? this.#getPosition(Math.min(...this.value)) : 0;
					const end = 100 - this.#getPosition(Math.max(...this.value));
					if (this.horizontal) {
						style.left = this.ltr ? `${start}%` : `${end}%`;
						style.right = this.ltr ? `${end}%` : `${start}%`;
					} else {
						style.top = this.ltr ? `${end}%` : `${start}%`;
						style.bottom = this.ltr ? `${start}%` : `${end}%`;
					}

					return styleToString(style);
				},
			},
		});
	}

	thumbs() {
		const count = this.value.length || 1;
		return Array(count)
			.fill(null)
			.map((_, i) => this.#thumb(i));
	}

	#thumb(i: number) {
		const thumbValue = $derived(this.value[i] || this.min);
		return element(ELEMENTS.thumb, {
			props: {
				role: "slider",
				"aria-valuemin": () => this.min,
				"aria-valuemax": () => this.max,
				"aria-valuenow": () => thumbValue,
				"aria-disabled": () => this.disabled,
				"aria-orientation": () => this.orientation,
				tabindex: () => {
					return this.disabled ? -1 : 0;
				},
				style: () => {
					const style: StyleObject = {
						position: "absolute",
					};

					const thumbPosition = this.#getPosition(thumbValue);
					if (this.horizontal) {
						const direction = this.ltr ? "left" : "right";
						style[direction] = `${thumbPosition}%`;
						style.translate = this.ltr ? "-50% 0" : "50% 0";
					} else {
						const direction = this.ltr ? "bottom" : "top";
						style[direction] = `${thumbPosition}%`;
						style.translate = this.ltr ? "0 50%" : "0 -50%";
					}

					return styleToString(style);
				},
				"data-value": () => thumbValue,
			},
			on: {
				keydown: (e) => this.#handleThumbKeyDown(e, i, thumbValue),
			},
		});
	}

	#handleThumbKeyDown(e: HTMLElementEvent<"keydown">, i: number, thumbValue: number) {
		if (this.disabled) return;
		switch (e.key) {
			case kbd.HOME: {
				e.preventDefault();
				this.#updatePosition(this.min, i);
				break;
			}
			case kbd.END: {
				e.preventDefault();
				this.#updatePosition(this.max, i);
				break;
			}
			case kbd.ARROW_LEFT: {
				if (!this.horizontal) break;

				e.preventDefault();

				if (e.metaKey) {
					const newValue = this.ltr ? this.min : this.max;
					this.#updatePosition(newValue, i);
				} else if (this.ltr && thumbValue > this.min) {
					this.#updatePosition(thumbValue - this.step, i);
				} else if (this.rtl && thumbValue < this.max) {
					this.#updatePosition(thumbValue + this.step, i);
				}

				break;
			}
			case kbd.ARROW_RIGHT: {
				if (!this.horizontal) break;

				e.preventDefault();

				if (e.metaKey) {
					const newValue = this.ltr ? this.max : this.min;
					this.#updatePosition(newValue, i);
				} else if (this.ltr && thumbValue < this.max) {
					this.#updatePosition(thumbValue + this.step, i);
				} else if (this.rtl && thumbValue > this.min) {
					this.#updatePosition(thumbValue - this.step, i);
				}

				break;
			}
			case kbd.ARROW_UP: {
				e.preventDefault();

				const topToBottom = this.vertical && this.rtl;
				if (e.metaKey) {
					const newValue = topToBottom ? this.min : this.max;
					this.#updatePosition(newValue, i);
				} else if (topToBottom && thumbValue > this.min) {
					this.#updatePosition(thumbValue - this.step, i);
				} else if (!topToBottom && thumbValue < this.max) {
					this.#updatePosition(thumbValue + this.step, i);
				}

				break;
			}
			case kbd.ARROW_DOWN: {
				e.preventDefault();

				const topToBottom = this.vertical && this.rtl;
				if (e.metaKey) {
					const newValue = topToBottom ? this.max : this.min;
					this.#updatePosition(newValue, i);
				} else if (topToBottom && thumbValue < this.max) {
					this.#updatePosition(thumbValue + this.step, i);
				} else if (!topToBottom && thumbValue > this.min) {
					this.#updatePosition(thumbValue - this.step, i);
				}

				break;
			}
		}
	}

	ticks() {
		const difference = this.max - this.min;

		// min = 0, max = 8, step = 3:
		// ----------------------------
		// 0, 3, 6
		// (8 - 0) / 3 = 2.666... = 3 ceiled
		let count = Math.ceil(difference / this.step);

		// min = 0, max = 9, step = 3:
		// ---------------------------
		// 0, 3, 6, 9
		// (9 - 0) / 3 = 3
		// We need to add 1 because `difference` is a multiple of `step`.
		if (difference % this.step == 0) {
			count++;
		}

		return Array(count)
			.fill(null)
			.map((_, i) => this.#tick(i, count));
	}

	#tick(i: number, count: number) {
		const tickValue = $derived(this.min + i * this.step);
		return element(ELEMENTS.tick, {
			props: {
				style: () => {
					const style: StyleObject = {
						position: "absolute",
					};

					// The track is divided into sections of ratio `step / (max - min)`
					const tickPosition = i * (this.step / (this.max - this.min)) * 100;

					// Offset each tick by -50% to center it, except the first and last ticks.
					// The first tick is already positioned at the start of the slider.
					// The last tick is offset by -100% to prevent it from being rendered outside.
					const isFirst = i === 0;
					const isLast = i === count - 1;
					const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;

					if (this.horizontal) {
						const direction = this.ltr ? "left" : "right";
						style[direction] = `${tickPosition}%`;
						style.translate = this.ltr ? `${offsetPercentage}% 0` : `${-offsetPercentage}% 0`;
					} else {
						const direction = this.ltr ? "bottom" : "top";
						style[direction] = `${tickPosition}%`;
						style.translate = this.ltr ? `0 ${-offsetPercentage}%` : `0 ${offsetPercentage}%`;
					}

					return styleToString(style);
				},
				"data-bounded": () => {
					if (this.value.length === 0) {
						return undefined;
					}
					if (this.value.length === 1) {
						return booleanAttr(tickValue <= this.value[0]!);
					}
					return booleanAttr(this.value[0]! <= tickValue && tickValue <= this.value.at(-1)!);
				},
				"data-value": () => tickValue,
			},
		});
	}

	// Effects
	readonly destroy = autoDestroyEffectRoot(() => {
		$effect(() => {
			if (this.disabled) return;

			$effect(() => {
				return addEventListener(
					document,
					"pointermove",
					this.#handleDocumentPointerMove.bind(this),
				);
			});

			$effect(() => {
				return addEventListener(document, "pointerdown", (e) => {
					if (e.button !== 0) return;

					const sliderEl = document.getElementById(this.rootId);
					const closestThumb = this.#getClosestThumb(e);
					if (closestThumb === null || sliderEl === null) return;

					const target = e.target;
					if (!isHTMLElement(target) || !sliderEl.contains(target)) return;

					e.preventDefault();

					this.#activeThumb = closestThumb;
					closestThumb.el.focus();
					this.#isActive = true;

					this.#handleDocumentPointerMove(e);
				});
			});

			$effect(() => {
				return addEventListener(document, "pointerup", () => {
					this.#isActive = false;
				});
			});

			$effect(() => {
				return addEventListener(document, "pointerleave", () => {
					this.#isActive = false;
				});
			});
		});

		$effect(() => {
			for (let i = 0; i < this.value.length; ++i) {
				const thumbValue = this.value[i]!;
				const snappedValue = snapValueToStep(thumbValue, this.min, this.max, this.step);
				if (snappedValue !== thumbValue) {
					this.value[i] = snappedValue;
				}
			}
		});
	});

	#handleDocumentPointerMove(e: PointerEvent) {
		if (!this.#isActive) return;

		e.preventDefault();
		e.stopPropagation();

		const sliderEl = document.getElementById(this.rootId);
		if (this.#activeThumb === null || sliderEl === null) return;

		this.#activeThumb.el.focus();

		const { left, right, top, bottom } = sliderEl.getBoundingClientRect();
		if (this.horizontal) {
			const start = this.ltr ? left : right;
			const end = this.ltr ? right : left;
			this.#applyPosition(e.clientX, this.#activeThumb.index, start, end);
		} else {
			const start = this.ltr ? bottom : top;
			const end = this.ltr ? top : bottom;
			this.#applyPosition(e.clientY, this.#activeThumb.index, start, end);
		}
	}
}
