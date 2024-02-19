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

// export const createSlider = (props?: CreateSliderProps) => {
// 	const withDefaults = { ...defaults, ...props } satisfies CreateSliderProps;

// 	const options = toWritableStores(omit(withDefaults, "value", "onValueChange", "defaultValue"));
// 	const { min, max, step, orientation, dir, disabled } = options;

// 	const valueWritable = withDefaults.value ?? writable(withDefaults.defaultValue);
// 	const value = overridable(valueWritable, withDefaults?.onValueChange);

// 	const isActive = withGet(writable(false));
// 	const currentThumbIndex = withGet(writable<number>(0));
// 	const activeThumb = withGet(writable<{ thumb: HTMLElement; index: number } | null>(null));

// 	const meltIds = generateIds(["root"] as const);

// Helpers

// 	const getAllThumbs = () => {
// 		const root = getElementByMeltId(meltIds.root);
// 		if (!root) return null;

// 		return Array.from(root.querySelectorAll('[data-melt-part="thumb"]')).filter(
// 			(thumb): thumb is HTMLElement => isHTMLElement(thumb),
// 		);
// 	};

// 	// States
// 	const position = derived([min, max], ([$min, $max]) => {
// 		return (val: number) => {
// 			const pos = ((val - $min) / ($max - $min)) * 100;
// 			return pos;
// 		};
// 	});

// 	const direction = withGet.derived([orientation, dir], ([$orientation, $dir]) => {
// 		if ($orientation === "horizontal") {
// 			return $dir === "rtl" ? "rl" : "lr";
// 		} else {
// 			return $dir === "rtl" ? "tb" : "bt";
// 		}
// 	});

// 	// Elements
// 	const root = makeElement(name(), {
// 		stores: [disabled, orientation, dir],
// 		returned: ([$disabled, $orientation, $dir]) => {
// 			return {
// 				dir: $dir,
// 				disabled: disabledAttr($disabled),
// 				"data-disabled": disabledAttr($disabled),
// 				"data-orientation": $orientation,
// 				style: $disabled
// 					? undefined
// 					: `touch-action: ${$orientation === "horizontal" ? "pan-y" : "pan-x"}`,

// 				"data-melt-id": meltIds.root,
// 			};
// 		},
// 	});

// 	const range = makeElement(name("range"), {
// 		stores: [value, direction, position],
// 		returned: ([$value, $direction, $position]) => {
// 			const minimum = $value.length > 1 ? $position(Math.min(...$value) ?? 0) : 0;
// 			const maximum = 100 - $position(Math.max(...$value) ?? 0);

// 			const style: StyleObject = {
// 				position: "absolute",
// 			};

// 			switch ($direction) {
// 				case "lr": {
// 					style.left = `${minimum}%`;
// 					style.right = `${maximum}%`;
// 					break;
// 				}
// 				case "rl": {
// 					style.right = `${minimum}%`;
// 					style.left = `${maximum}%`;
// 					break;
// 				}
// 				case "bt": {
// 					style.bottom = `${minimum}%`;
// 					style.top = `${maximum}%`;
// 					break;
// 				}
// 				case "tb": {
// 					style.top = `${minimum}%`;
// 					style.bottom = `${maximum}%`;
// 					break;
// 				}
// 			}

// 			return {
// 				style: styleToString(style),
// 			};
// 		},
// 	});

// 	const thumbs = makeElementArray(name("thumb"), {
// 		stores: [value, position, min, max, disabled, orientation, direction],
// 		returned: ([$value, $position, $min, $max, $disabled, $orientation, $direction]) => {
// 			const result = Array.from({ length: $value.length || 1 }, (_, i) => {
// 				const currentThumb = currentThumbIndex.get();

// 				if (currentThumb < $value.length) {
// 					currentThumbIndex.update((prev) => prev + 1);
// 				}

// 				const thumbValue = $value[i];
// 				const thumbPosition = `${$position(thumbValue)}%`;

// 				const style: StyleObject = {
// 					position: "absolute",
// 				};

// 				switch ($direction) {
// 					case "lr": {
// 						style.left = thumbPosition;
// 						style.translate = "-50% 0";
// 						break;
// 					}
// 					case "rl": {
// 						style.right = thumbPosition;
// 						style.translate = "50% 0";
// 						break;
// 					}
// 					case "bt": {
// 						style.bottom = thumbPosition;
// 						style.translate = "0 50%";
// 						break;
// 					}
// 					case "tb": {
// 						style.top = thumbPosition;
// 						style.translate = "0 -50%";
// 						break;
// 					}
// 				}

// 				return {
// 					role: "slider",
// 					"aria-valuemin": $min,
// 					"aria-valuemax": $max,
// 					"aria-valuenow": thumbValue,
// 					"aria-disabled": disabledAttr($disabled),
// 					"aria-orientation": $orientation,
// 					"data-melt-part": "thumb",
// 					"data-value": thumbValue,
// 					style: styleToString(style),
// 					tabindex: $disabled ? -1 : 0,
// 				} as const;
// 			});

// 			type Thumb = (typeof result)[number];
// 			return result as NonEmptyArray<Thumb>;
// 		},
// 		action: (node: HTMLElement): MeltActionReturn<SliderEvents["thumb"]> => {
// 			const unsub = addMeltEventListener(node, "keydown", (event) => {
// 				if (disabled.get()) return;

// 				const target = event.currentTarget;
// 				if (!isHTMLElement(target)) return;
// 				const thumbs = getAllThumbs();
// 				if (!thumbs?.length) return;

// 				const index = thumbs.indexOf(target);
// 				currentThumbIndex.set(index);

// 				if (
// 					![
// 						kbd.ARROW_LEFT,
// 						kbd.ARROW_RIGHT,
// 						kbd.ARROW_UP,
// 						kbd.ARROW_DOWN,
// 						kbd.HOME,
// 						kbd.END,
// 					].includes(event.key)
// 				) {
// 					return;
// 				}

// 				event.preventDefault();

// 				const $min = min.get();
// 				const $max = max.get();
// 				const $step = step.get();
// 				const $value = value.get();
// 				const $orientation = orientation.get();
// 				const $direction = direction.get();
// 				const thumbValue = $value[index];

// 				switch (event.key) {
// 					case kbd.HOME: {
// 						updatePosition($min, index);
// 						break;
// 					}
// 					case kbd.END: {
// 						updatePosition($max, index);
// 						break;
// 					}
// 					case kbd.ARROW_LEFT: {
// 						if ($orientation !== "horizontal") break;

// 						if (event.metaKey) {
// 							const newValue = $direction === "rl" ? $max : $min;
// 							updatePosition(newValue, index);
// 						} else if ($direction === "rl" && thumbValue < $max) {
// 							updatePosition(thumbValue + $step, index);
// 						} else if ($direction === "lr" && thumbValue > $min) {
// 							updatePosition(thumbValue - $step, index);
// 						}
// 						break;
// 					}
// 					case kbd.ARROW_RIGHT: {
// 						if ($orientation !== "horizontal") break;

// 						if (event.metaKey) {
// 							const newValue = $direction === "rl" ? $min : $max;
// 							updatePosition(newValue, index);
// 						} else if ($direction === "rl" && thumbValue > $min) {
// 							updatePosition(thumbValue - $step, index);
// 						} else if ($direction === "lr" && thumbValue < $max) {
// 							updatePosition(thumbValue + $step, index);
// 						}
// 						break;
// 					}
// 					case kbd.ARROW_UP: {
// 						if (event.metaKey) {
// 							const newValue = $direction === "tb" ? $min : $max;
// 							updatePosition(newValue, index);
// 						} else if ($direction === "tb" && thumbValue > $min) {
// 							updatePosition(thumbValue - $step, index);
// 						} else if ($direction !== "tb" && thumbValue < $max) {
// 							updatePosition(thumbValue + $step, index);
// 						}
// 						break;
// 					}
// 					case kbd.ARROW_DOWN: {
// 						if (event.metaKey) {
// 							const newValue = $direction === "tb" ? $max : $min;
// 							updatePosition(newValue, index);
// 						} else if ($direction === "tb" && thumbValue < $max) {
// 							updatePosition(thumbValue + $step, index);
// 						} else if ($direction !== "tb" && thumbValue > $min) {
// 							updatePosition(thumbValue - $step, index);
// 						}
// 						break;
// 					}
// 				}
// 			});

// 			return {
// 				destroy: unsub,
// 			};
// 		},
// 	});

// 	const ticks = makeElementArray(name("tick"), {
// 		stores: [value, min, max, step, direction],
// 		returned: ([$value, $min, $max, $step, $direction]) => {
// 			const difference = $max - $min;

// 			// min = 0, max = 8, step = 3:
// 			// ----------------------------
// 			// 0, 3, 6
// 			// (8 - 0) / 3 = 2.666... = 3 ceiled
// 			let count = Math.ceil(difference / $step);

// 			// min = 0, max = 9, step = 3:
// 			// ---------------------------
// 			// 0, 3, 6, 9
// 			// (9 - 0) / 3 = 3
// 			// We need to add 1 because `difference` is a multiple of `step`.
// 			if (difference % $step == 0) {
// 				count++;
// 			}

// 			return Array.from({ length: count }, (_, i) => {
// 				// The track is divided into sections of ratio `step / (max - min)`
// 				const tickPosition = `${i * ($step / ($max - $min)) * 100}%`;

// 				// Offset each tick by -50% to center it, except the first and last ticks.
// 				// The first tick is already positioned at the start of the slider.
// 				// The last tick is offset by -100% to prevent it from being rendered outside.
// 				const isFirst = i === 0;
// 				const isLast = i === count - 1;
// 				const offsetPercentage = isFirst ? 0 : isLast ? -100 : -50;

// 				const style: StyleObject = {
// 					position: "absolute",
// 				};

// 				switch ($direction) {
// 					case "lr": {
// 						style.left = tickPosition;
// 						style.translate = `${offsetPercentage}% 0`;
// 						break;
// 					}
// 					case "rl": {
// 						style.right = tickPosition;
// 						style.translate = `${-offsetPercentage}% 0`;
// 						break;
// 					}
// 					case "bt": {
// 						style.bottom = tickPosition;
// 						style.translate = `0 ${-offsetPercentage}%`;
// 						break;
// 					}
// 					case "tb": {
// 						style.top = tickPosition;
// 						style.translate = `0 ${offsetPercentage}%`;
// 						break;
// 					}
// 				}

// 				const tickValue = $min + i * $step;
// 				const bounded =
// 					$value.length === 1
// 						? tickValue <= $value[0]
// 						: $value[0] <= tickValue && tickValue <= $value[$value.length - 1];

// 				return {
// 					"data-bounded": bounded ? true : undefined,
// 					"data-value": tickValue,
// 					style: styleToString(style),
// 				};
// 			});
// 		},
// 	});

// 	// Effects
// 	effect(
// 		[root, min, max, disabled, orientation, direction, step],
// 		([$root, $min, $max, $disabled, $orientation, $direction, $step]) => {
// 			if (!isBrowser || $disabled) return;

// 			const applyPosition = (
// 				clientXY: number,
// 				activeThumbIdx: number,
// 				start: number,
// 				end: number,
// 			) => {
// 				const percent = (clientXY - start) / (end - start);
// 				const val = percent * ($max - $min) + $min;

// 				if (val < $min) {
// 					updatePosition($min, activeThumbIdx);
// 				} else if (val > $max) {
// 					updatePosition($max, activeThumbIdx);
// 				} else {
// 					const step = $step;
// 					const min = $min;

// 					const currentStep = Math.floor((val - min) / step);
// 					const midpointOfCurrentStep = min + currentStep * step + step / 2;
// 					const midpointOfNextStep = min + (currentStep + 1) * step + step / 2;
// 					const newValue =
// 						val >= midpointOfCurrentStep && val < midpointOfNextStep
// 							? (currentStep + 1) * step + min
// 							: currentStep * step + min;

// 					if (newValue <= $max) {
// 						updatePosition(newValue, activeThumbIdx);
// 					}
// 				}
// 			};

// 			const getClosestThumb = (e: PointerEvent) => {
// 				const thumbs = getAllThumbs();
// 				if (!thumbs) return;
// 				thumbs.forEach((thumb) => thumb.blur());

// 				const distances = thumbs.map((thumb) => {
// 					if ($orientation === "horizontal") {
// 						const { left, right } = thumb.getBoundingClientRect();
// 						return Math.abs(e.clientX - (left + right) / 2);
// 					} else {
// 						const { top, bottom } = thumb.getBoundingClientRect();
// 						return Math.abs(e.clientY - (top + bottom) / 2);
// 					}
// 				});

// 				const thumb = thumbs[distances.indexOf(Math.min(...distances))];
// 				const index = thumbs.indexOf(thumb);

// 				return { thumb, index };
// 			};

// 			const pointerMove = (e: PointerEvent) => {
// 				if (!isActive.get()) return;
// 				e.preventDefault();
// 				e.stopPropagation();

// 				const sliderEl = getElementByMeltId($root["data-melt-id"]);
// 				const closestThumb = activeThumb.get();
// 				if (!sliderEl || !closestThumb) return;

// 				closestThumb.thumb.focus();

// 				const { left, right, top, bottom } = sliderEl.getBoundingClientRect();
// 				switch ($direction) {
// 					case "lr": {
// 						applyPosition(e.clientX, closestThumb.index, left, right);
// 						break;
// 					}
// 					case "rl": {
// 						applyPosition(e.clientX, closestThumb.index, right, left);
// 						break;
// 					}
// 					case "bt": {
// 						applyPosition(e.clientY, closestThumb.index, bottom, top);
// 						break;
// 					}
// 					case "tb": {
// 						applyPosition(e.clientY, closestThumb.index, top, bottom);
// 						break;
// 					}
// 				}
// 			};

// 			const pointerDown = (e: PointerEvent) => {
// 				if (e.button !== 0) return;

// 				const sliderEl = getElementByMeltId($root["data-melt-id"]);
// 				const closestThumb = getClosestThumb(e);
// 				if (!closestThumb || !sliderEl) return;

// 				const target = e.target;
// 				if (!isHTMLElement(target) || !sliderEl.contains(target)) {
// 					return;
// 				}
// 				e.preventDefault();

// 				activeThumb.set(closestThumb);
// 				closestThumb.thumb.focus();
// 				isActive.set(true);

// 				pointerMove(e);
// 			};

// 			const pointerUp = () => {
// 				isActive.set(false);
// 			};

// 			const unsub = executeCallbacks(
// 				addEventListener(document, "pointerdown", pointerDown),
// 				addEventListener(document, "pointerup", pointerUp),
// 				addEventListener(document, "pointerleave", pointerUp),
// 				addEventListener(document, "pointermove", pointerMove),
// 			);

// 			return () => {
// 				unsub();
// 			};
// 		},
// 	);

// 	effect([step, min, max, value], function fixValue([$step, $min, $max, $value]) {
// 		const isValidValue = (v: number) => {
// 			const snappedValue = snapValueToStep(v, $min, $max, $step);
// 			return snappedValue === v;
// 		};

// 		const gcv = (v: number) => {
// 			return snapValueToStep(v, $min, $max, $step);
// 		};

// 		if ($value.some((v) => !isValidValue(v))) {
// 			value.update((prev) => {
// 				return prev.map(gcv);
// 			});
// 		}
// 	});

// 	return {
// 		elements: {
// 			root,
// 			thumbs,
// 			range,
// 			ticks,
// 		},
// 		states: {
// 			value,
// 		},
// 		options,
// 	};
// };
