import { useFloating, usePortal, type FloatingConfig } from "$lib/internal/actions/index.js";
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
	#open: WritableBox<boolean>;
	#positioning: ReadableBox<FloatingConfig>;
	#arrowSize: ReadableBox<number>;
	#openDelay: ReadableBox<number>;
	#closeDelay: ReadableBox<number>;
	#closeOnPointerDown: ReadableBox<boolean>;
	#closeOnEscape: ReadableBox<boolean>;
	#forceVisible: ReadableBox<boolean>;
	#disableHoverableContent: ReadableBox<boolean>;
	#group: ReadableBox<string | boolean | undefined>;
	#portal: ReadableBox<HTMLElement | string | null>;
	#triggerId: ReadableBox<string>;
	#contentId: ReadableBox<string>;

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
			portal = "body",
			triggerId = generateId(),
			contentId = generateId(),
		} = props;

		this.#open = writableBox(open);
		this.#positioning = readableBox(positioning);
		this.#arrowSize = readableBox(arrowSize);
		this.#openDelay = readableBox(openDelay);
		this.#closeDelay = readableBox(closeDelay);
		this.#closeOnPointerDown = readableBox(closeOnPointerDown);
		this.#closeOnEscape = readableBox(closeOnEscape);
		this.#forceVisible = readableBox(forceVisible);
		this.#disableHoverableContent = readableBox(disableHoverableContent);
		this.#group = readableBox(group);
		this.#portal = readableBox(portal);
		this.#triggerId = readableBox(triggerId);
		this.#contentId = readableBox(contentId);
	}

	#openReason: OpenReason | null = $state(null);
	#isMouseInTooltipArea = false;
	#clickedTrigger = false;
	#openTimeout: number | null = null;
	#closeTimeout: number | null = null;

	// States
	get open() {
		return this.#open.value;
	}

	set open(value) {
		this.#open.value = value;
		this.#clearOpenTimeout();
		this.#clearCloseTimeout();
	}

	get positioning() {
		return this.#positioning.value;
	}

	get arrowSize() {
		return this.#arrowSize.value;
	}

	get openDelay() {
		return this.#openDelay.value;
	}

	get closeDelay() {
		return this.#closeDelay.value;
	}

	get closeOnPointerDown() {
		return this.#closeOnPointerDown.value;
	}

	get closeOnEscape() {
		return this.#closeOnEscape.value;
	}

	get forceVisible() {
		return this.#forceVisible.value;
	}

	get disableHoverableContent() {
		return this.#disableHoverableContent.value;
	}

	get group() {
		return this.#group.value;
	}

	get portal() {
		return this.#portal.value;
	}

	get triggerId() {
		return this.#triggerId.value;
	}

	get contentId() {
		return this.#contentId.value;
	}

	get #hidden() {
		return !this.open && !this.forceVisible;
	}

	// Helpers
	#clearOpenTimeout() {
		if (this.#openTimeout) {
			window.clearTimeout(this.#openTimeout);
			this.#openTimeout = null;
		}
	}

	#clearCloseTimeout() {
		if (this.#closeTimeout) {
			window.clearTimeout(this.#closeTimeout);
			this.#closeTimeout = null;
		}
	}

	#openTooltip(reason: OpenReason) {
		this.#clearCloseTimeout();

		if (!this.#openTimeout) {
			this.#openTimeout = window.setTimeout(() => {
				this.open = true;
				// Don't override the reason if it's already set.
				this.#openReason ??= reason;
			}, this.openDelay);
		}
	}

	#closeTooltip(isBlur?: boolean) {
		this.#clearOpenTimeout();

		if (isBlur && this.#isMouseInTooltipArea) {
			// Normally when blurring the trigger, we want to close the tooltip.
			// The exception is when the mouse is still in the tooltip area.
			// In that case, we have to set the openReason to pointer, so that
			// it can close when the mouse leaves the tooltip area.
			this.#openReason = "pointer";
			return;
		}

		if (!this.#closeTimeout) {
			this.#closeTimeout = window.setTimeout(() => {
				this.open = false;
				this.#openReason = null;
				if (isBlur) this.#clickedTrigger = false;
			}, this.closeDelay);
		}
	}

	// Elements
	readonly trigger = this.#createTrigger();

	#createTrigger() {
		const self = this;
		return element("tooltip-trigger", {
			get "aria-describedby"() {
				return self.contentId;
			},
			get id() {
				return self.triggerId;
			},
			onpointerdown() {
				if (!self.closeOnPointerDown) return;
				self.open = false;
				self.#clickedTrigger = true;
			},
			onpointerenter(e: PointerEvent) {
				if (isTouch(e)) return;
				self.#openTooltip("pointer");
			},
			onpointerleave(e: PointerEvent) {
				if (isTouch(e)) return;
				self.#clearOpenTimeout();
			},
			onfocus() {
				if (self.#clickedTrigger) return;
				self.#openTooltip("focus");
			},
			onblur() {
				self.#closeTooltip(true);
			},
			onkeydown: self.#handleKeyDown.bind(self),
		});
	}

	#handleKeyDown(e: KeyboardEvent) {
		if (this.closeOnEscape && e.key === kbd.ESCAPE) {
			this.open = false;
		}
	}

	readonly content = this.#createContent();

	#createContent() {
		const self = this;
		return element("tooltip-content", {
			role: "tooltip",
			tabindex: -1,
			get hidden() {
				return booleanAttr(self.#hidden);
			},
			get style() {
				return self.#hidden ? "display: none;" : undefined;
			},
			get id() {
				return self.contentId;
			},
			get "data-portal"() {
				return self.portal ? "" : undefined;
			},
			onpointerenter() {
				self.#openTooltip("pointer");
			},
			onpointerdown() {
				self.#openTooltip("pointer");
			},
		});
	}

	readonly arrow = this.#createArrow();

	#createArrow() {
		const self = this;
		return element("tooltip-arrow", {
			"data-arrow": true,
			get style() {
				const size = `var(--arrow-size, ${self.arrowSize}px)`;
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
			if (group === undefined || group === false) return;

			const cleanup = () => {
				if (openTooltips.get(group) === this) {
					openTooltips.delete(group);
				}
			};

			if (!this.open) {
				cleanup();
				return;
			}

			// Close the currently open tooltip in the same group
			// and set this tooltip as the open one.
			const openTooltip = openTooltips.get(group);
			if (openTooltip && openTooltip !== this) {
				openTooltip.open = false;
			}
			openTooltips.set(group, this);
			return cleanup;
		});

		$effect(() => {
			if (!this.open) return;
			return addEventListener(document, "mousemove", (e) => {
				const triggerEl = document.getElementById(this.triggerId);
				const contentEl = document.getElementById(this.contentId);
				if (!triggerEl || !contentEl) return;

				const polygonElements = this.disableHoverableContent ? [triggerEl] : [triggerEl, contentEl];
				const polygon = makeHullFromElements(polygonElements);

				this.#isMouseInTooltipArea = pointInPolygon(
					{
						x: e.clientX,
						y: e.clientY,
					},
					polygon,
				);

				if (this.#openReason !== "pointer") return;

				if (!this.#isMouseInTooltipArea) {
					this.#closeTooltip();
				}
			});
		});

		$effect(() => {
			return addEventListener(document, "keydown", this.#handleKeyDown.bind(this));
		});

		let unsubFloating = noop;
		let unsubPortal = noop;

		$effect(() => {
			if (this.#hidden) return;

			const triggerEl = document.getElementById(this.triggerId);
			const contentEl = document.getElementById(this.contentId);
			if (!triggerEl || !contentEl) {
				unsubFloating();
				unsubPortal();
				return;
			}

			const floatingReturn = useFloating(triggerEl, contentEl, this.positioning);
			unsubFloating = floatingReturn.destroy;
			if (!this.portal) {
				unsubFloating();
				return;
			}

			const portalDest = getPortalDestination(contentEl, this.portal);
			if (portalDest) {
				const portalReturn = usePortal(contentEl, portalDest);
				if (portalReturn && portalReturn.destroy) {
					unsubPortal = portalReturn.destroy;
				}
			}
		});

		return () => {
			unsubFloating();
			unsubPortal();
		};
	});
}
