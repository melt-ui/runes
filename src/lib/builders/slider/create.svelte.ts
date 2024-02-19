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
		const self = this;
		return element(ELEMENTS.root, {
			get id() {
				return self.rootId;
			},
			get dir() {
				return self.dir;
			},
			get disabled() {
				return booleanAttr(self.disabled);
			},
			get style() {
				return styleToString({
					position: "relative",
					"touch-action": self.disabled ? undefined : self.horizontal ? "pan-y" : "pan-x",
				});
			},
			get "data-disabled"() {
				return booleanAttr(self.disabled);
			},
			get "data-orientation"() {
				return self.orientation;
			},
		});
	}

	range() {
		const self = this;
		return element(ELEMENTS.range, {
			get style() {
				const style: StyleObject = {
					position: "absolute",
				};

				const start = self.value.length > 1 ? self.#getPosition(Math.min(...self.value)) : 0;
				const end = 100 - self.#getPosition(Math.max(...self.value));
				if (self.horizontal) {
					style.left = self.ltr ? `${start}%` : `${end}%`;
					style.right = self.ltr ? `${end}%` : `${start}%`;
				} else {
					style.top = self.ltr ? `${end}%` : `${start}%`;
					style.bottom = self.ltr ? `${start}%` : `${end}%`;
				}

				return styleToString(style);
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
		const self = this;
		const thumbValue = $derived(self.value[i] || self.min);
		return element(ELEMENTS.thumb, {
			role: "slider",
			get "aria-valuemin"() {
				return self.min;
			},
			get "aria-valuemax"() {
				return self.max;
			},
			get "aria-valuenow"() {
				return thumbValue;
			},
			get "aria-disabled"() {
				return self.disabled;
			},
			get "aria-orientation"() {
				return self.orientation;
			},
			get tabindex() {
				return self.disabled ? -1 : 0;
			},
			get style() {
				const style: StyleObject = {
					position: "absolute",
				};

				const thumbPosition = self.#getPosition(thumbValue);
				if (self.horizontal) {
					const direction = self.ltr ? "left" : "right";
					style[direction] = `${thumbPosition}%`;
					style.translate = self.ltr ? "-50% 0" : "50% 0";
				} else {
					const direction = self.ltr ? "bottom" : "top";
					style[direction] = `${thumbPosition}%`;
					style.translate = self.ltr ? "0 50%" : "0 -50%";
				}

				return styleToString(style);
			},
			get "data-value"() {
				return thumbValue;
			},
			onkeydown(e: KeyboardEvent) {
				if (self.disabled) return;
				switch (e.key) {
					case kbd.HOME: {
						e.preventDefault();
						self.#updatePosition(self.min, i);
						break;
					}
					case kbd.END: {
						e.preventDefault();
						self.#updatePosition(self.max, i);
						break;
					}
					case kbd.ARROW_LEFT: {
						if (!self.horizontal) break;

						e.preventDefault();

						if (e.metaKey) {
							const newValue = self.ltr ? self.min : self.max;
							self.#updatePosition(newValue, i);
						} else if (self.ltr && thumbValue > self.min) {
							self.#updatePosition(thumbValue - self.step, i);
						} else if (self.rtl && thumbValue < self.max) {
							self.#updatePosition(thumbValue + self.step, i);
						}

						break;
					}
					case kbd.ARROW_RIGHT: {
						if (!self.horizontal) break;

						e.preventDefault();

						if (e.metaKey) {
							const newValue = self.ltr ? self.max : self.min;
							self.#updatePosition(newValue, i);
						} else if (self.ltr && thumbValue < self.max) {
							self.#updatePosition(thumbValue + self.step, i);
						} else if (self.rtl && thumbValue > self.min) {
							self.#updatePosition(thumbValue - self.step, i);
						}

						break;
					}
					case kbd.ARROW_UP: {
						e.preventDefault();

						const topToBottom = self.vertical && self.rtl;
						if (e.metaKey) {
							const newValue = topToBottom ? self.min : self.max;
							self.#updatePosition(newValue, i);
						} else if (topToBottom && thumbValue > self.min) {
							self.#updatePosition(thumbValue - self.step, i);
						} else if (!topToBottom && thumbValue < self.max) {
							self.#updatePosition(thumbValue + self.step, i);
						}

						break;
					}
					case kbd.ARROW_DOWN: {
						e.preventDefault();

						const topToBottom = self.vertical && self.rtl;
						if (e.metaKey) {
							const newValue = topToBottom ? self.max : self.min;
							self.#updatePosition(newValue, i);
						} else if (topToBottom && thumbValue < self.max) {
							self.#updatePosition(thumbValue + self.step, i);
						} else if (!topToBottom && thumbValue > self.min) {
							self.#updatePosition(thumbValue - self.step, i);
						}

						break;
					}
				}
			},
		});
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
		const self = this;
		const tickValue = $derived(self.min + i * self.step);
		return element(ELEMENTS.tick, {
			get style() {
				const style: StyleObject = {
					position: "absolute",
				};

				// The track is divided into sections of ratio `step / (max - min)`
				const tickPosition = i * (self.step / (self.max - self.min)) * 100;

				// Offset each tick by -50% to center it, except the first and last ticks.
				// The first tick is already positioned at the start of the slider.
				// The last tick is offset by -100% to prevent it from being rendered outside.
				const isFirst = i === 0;
				const isLast = i === count - 1;
				const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;

				if (self.horizontal) {
					const direction = self.ltr ? "left" : "right";
					style[direction] = `${tickPosition}%`;
					style.translate = self.ltr ? `${offsetPercentage}% 0` : `${-offsetPercentage}% 0`;
				} else {
					const direction = self.ltr ? "bottom" : "top";
					style[direction] = `${tickPosition}%`;
					style.translate = self.ltr ? `0 ${-offsetPercentage}%` : `0 ${offsetPercentage}%`;
				}

				return styleToString(style);
			},
			get "data-bounded"() {
				if (self.value.length === 0) {
					return undefined;
				}
				if (self.value.length === 1) {
					return booleanAttr(tickValue <= self.value[0]!);
				}
				return booleanAttr(self.value[0]! <= tickValue && tickValue <= self.value.at(-1)!);
			},
			get "data-value"() {
				return tickValue;
			},
		});
	}

	// Effects
	readonly destroy = autoDestroyEffectRoot(() => {
		$effect(() => {
			if (this.disabled) return;

			$effect(() => {
				return addEventListener(document, "pointermove", this.#handleDocumentPointerMove);
			});

			$effect(() => {
				return addEventListener(document, "pointerdown", this.#handleDocumentPointerDown);
			});

			$effect(() => {
				return addEventListener(document, "pointerup", this.#handleDocumentPointerUpOrLeave);
			});

			$effect(() => {
				return addEventListener(document, "pointerleave", this.#handleDocumentPointerUpOrLeave);
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

	readonly #handleDocumentPointerMove = (e: PointerEvent) => {
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
	};

	readonly #handleDocumentPointerDown = (e: PointerEvent) => {
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
	};

	readonly #handleDocumentPointerUpOrLeave = () => {
		this.#isActive = false;
	};
}
