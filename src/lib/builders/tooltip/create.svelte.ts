import {
	useFloating,
	usePortal,
	type FloatingConfig,
	type PortalTarget,
} from "$lib/internal/actions/index.js";
import {
	addEventListener,
	autoDestroyEffectRoot,
	booleanAttr,
	element,
	generateId,
	getPortalDestination,
	isTouch,
	kbd,
	makeHullFromElements,
	noop,
	pointInPolygon,
	portalAttr,
	readableBox,
	styleToString,
	writableBox,
	type ReadableBox,
	type WritableBox,
} from "$lib/internal/helpers/index.js";
import type { TooltipProps } from "./types.js";

// Store a global map to get the currently open tooltip in a given group.
const openTooltips = new Map<string | true, Tooltip>();

type OpenReason = "pointer" | "focus";

export class Tooltip {
	#openBox: WritableBox<boolean>;
	#positioningBox: ReadableBox<FloatingConfig | null>;
	#arrowSizeBox: ReadableBox<number>;
	#openDelayBox: ReadableBox<number>;
	#closeDelayBox: ReadableBox<number>;
	#closeOnPointerDownBox: ReadableBox<boolean>;
	#closeOnEscapeBox: ReadableBox<boolean>;
	#forceVisibleBox: ReadableBox<boolean>;
	#disableHoverableContentBox: ReadableBox<boolean>;
	#groupBox: ReadableBox<string | boolean | undefined>;
	#portalBox: ReadableBox<PortalTarget | null>;
	#triggerIdBox: ReadableBox<string>;
	#contentIdBox: ReadableBox<string>;

	constructor(props: TooltipProps = {}) {
		const {
			open = false,
			positioning = { placement: "bottom" },
			arrowSize = 8,
			openDelay = 1000,
			closeDelay = 0,
			closeOnPointerDown = true,
			closeOnEscape = true,
			forceVisible = false,
			disableHoverableContent = false,
			group,
			portal,
			triggerId = generateId(),
			contentId = generateId(),
		} = props;

		this.#openBox = writableBox(open);
		this.#positioningBox = readableBox(positioning);
		this.#arrowSizeBox = readableBox(arrowSize);
		this.#openDelayBox = readableBox(openDelay);
		this.#closeDelayBox = readableBox(closeDelay);
		this.#closeOnPointerDownBox = readableBox(closeOnPointerDown);
		this.#closeOnEscapeBox = readableBox(closeOnEscape);
		this.#forceVisibleBox = readableBox(forceVisible);
		this.#disableHoverableContentBox = readableBox(disableHoverableContent);
		this.#groupBox = readableBox(group);
		this.#portalBox = readableBox(portal);
		this.#triggerIdBox = readableBox(triggerId);
		this.#contentIdBox = readableBox(contentId);
	}

	#openReason: OpenReason | null = null;
	#isMouseInTooltipArea = false;
	#clickedTrigger = false;
	#openTimeout: number | null = null;
	#closeTimeout: number | null = null;

	// States
	get open() {
		return this.#openBox.value;
	}

	set open(value) {
		this.#openBox.value = value;
		this.#clearOpenTimeout();
		this.#clearCloseTimeout();
	}

	get positioning() {
		return this.#positioningBox.value;
	}

	get arrowSize() {
		return this.#arrowSizeBox.value;
	}

	get openDelay() {
		return this.#openDelayBox.value;
	}

	get closeDelay() {
		return this.#closeDelayBox.value;
	}

	get closeOnPointerDown() {
		return this.#closeOnPointerDownBox.value;
	}

	get closeOnEscape() {
		return this.#closeOnEscapeBox.value;
	}

	get forceVisible() {
		return this.#forceVisibleBox.value;
	}

	get disableHoverableContent() {
		return this.#disableHoverableContentBox.value;
	}

	get group() {
		return this.#groupBox.value;
	}

	get portal() {
		return this.#portalBox.value;
	}

	get triggerId() {
		return this.#triggerIdBox.value;
	}

	get contentId() {
		return this.#contentIdBox.value;
	}

	get #hidden() {
		return !this.open && !this.forceVisible;
	}

	// Helpers
	#clearOpenTimeout() {
		if (this.#openTimeout !== null) {
			window.clearTimeout(this.#openTimeout);
			this.#openTimeout = null;
		}
	}

	#clearCloseTimeout() {
		if (this.#closeTimeout !== null) {
			window.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}

	#open(reason: OpenReason) {
		this.#clearCloseTimeout();

		if (this.#openTimeout !== null) {
			return;
		}

		this.#openTimeout = window.setTimeout(() => {
			this.open = true;
			// Don't override the reason if it's already set.
			this.#openReason ??= reason;
		}, this.openDelay);
	}

	#close(isBlur: boolean = false) {
		this.#clearOpenTimeout();

		if (isBlur && this.#isMouseInTooltipArea) {
			// Normally when blurring the trigger, we want to close the tooltip.
			// The exception is when the mouse is still in the tooltip area.
			// In that case, we have to set the openReason to pointer, so that
			// it can close when the mouse leaves the tooltip area.
			this.#openReason = "pointer";
			return;
		}

		if (this.#closeTimeout !== null) {
			return;
		}

		this.#closeTimeout = window.setTimeout(() => {
			this.open = false;
			this.#openReason = null;
			if (isBlur) {
				this.#clickedTrigger = false;
			}
		}, this.closeDelay);
	}

	// Elements
	trigger() {
		const tooltip = this;
		return element("tooltip-trigger", {
			get id() {
				return tooltip.triggerId;
			},
			get "aria-describedby"() {
				return tooltip.contentId;
			},
			onpointerdown() {
				if (tooltip.closeOnPointerDown) {
					tooltip.open = false;
					tooltip.#clickedTrigger = true;
				}
			},
			onpointerenter(event) {
				if (!isTouch(event)) {
					tooltip.#open("pointer");
				}
			},
			onpointerleave(event) {
				if (!isTouch(event)) {
					tooltip.#clearOpenTimeout();
				}
			},
			onfocus() {
				if (!tooltip.#clickedTrigger) {
					tooltip.#open("focus");
				}
			},
			onblur() {
				tooltip.#close(true);
			},
			onkeydown: tooltip.#handleKeyDown.bind(tooltip),
		});
	}

	#handleKeyDown(event: KeyboardEvent) {
		if (this.closeOnEscape && event.key === kbd.ESCAPE) {
			this.open = false;
		}
	}

	content() {
		const tooltip = this;
		return element("tooltip-content", {
			role: "tooltip",
			tabindex: -1,
			get id() {
				return tooltip.contentId;
			},
			get hidden() {
				return booleanAttr(tooltip.#hidden);
			},
			get style() {
				return tooltip.#hidden ? "display: none;" : undefined;
			},
			get "data-portal"() {
				return portalAttr(tooltip.portal);
			},
			onpointerenter() {
				tooltip.#open("pointer");
			},
			onpointerdown() {
				tooltip.#open("pointer");
			},
		});
	}

	arrow() {
		const tooltip = this;
		return element("tooltip-arrow", {
			"data-arrow": true,
			get style() {
				const size = `var(--arrow-size, ${tooltip.arrowSize}px)`;
				return styleToString({
					position: "absolute",
					width: size,
					height: size,
				});
			},
		});
	}

	// Effects
	readonly destroy = autoDestroyEffectRoot(() => {
		$effect(() => {
			const group = this.group;
			if (group === undefined || group === false || !this.open) {
				return;
			}

			// Close the currently open tooltip in the same group
			// and replace it with this one.
			const openTooltip = openTooltips.get(group);
			if (openTooltip !== undefined && openTooltip !== this) {
				openTooltip.open = false;
			}
			openTooltips.set(group, this);

			return () => {
				if (openTooltips.get(group) === this) {
					openTooltips.delete(group);
				}
			};
		});

		$effect(() => {
			if (!this.open) {
				return;
			}

			return addEventListener(document, "mousemove", (event) => {
				const triggerEl = document.getElementById(this.triggerId);
				const contentEl = document.getElementById(this.contentId);
				if (triggerEl === null || contentEl === null) {
					return;
				}

				const polygonElements = this.disableHoverableContent ? [triggerEl] : [triggerEl, contentEl];
				const polygon = makeHullFromElements(polygonElements);

				this.#isMouseInTooltipArea = pointInPolygon(
					{
						x: event.clientX,
						y: event.clientY,
					},
					polygon,
				);

				if (this.#openReason === "pointer" && !this.#isMouseInTooltipArea) {
					this.#close();
				}
			});
		});

		$effect(() => {
			return addEventListener(document, "keydown", this.#handleKeyDown.bind(this));
		});

		let cleanupFloating = noop;
		let cleanupPortal = noop;

		$effect(() => {
			const triggerEl = document.getElementById(this.triggerId);
			const contentEl = document.getElementById(this.contentId);
			if (this.#hidden || triggerEl === null || contentEl === null) {
				cleanupFloating();
				cleanupPortal();
				cleanupFloating = cleanupPortal = noop;
				return;
			}

			const floatingReturn = useFloating(triggerEl, contentEl, this.positioning);
			cleanupFloating();
			cleanupFloating = floatingReturn.destroy;

			if (this.portal === null) {
				cleanupPortal();
				cleanupPortal = noop;
				return;
			}

			const portalDest = getPortalDestination(contentEl, this.portal);
			const portalReturn = usePortal(contentEl, portalDest);
			cleanupPortal = portalReturn.destroy;
		});

		return () => {
			cleanupFloating();
			cleanupPortal();
		};
	});
}
