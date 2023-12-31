import { useFloating, usePortal, type FloatingConfig } from "$lib/internal/actions";
import {
	addEventListener,
	generateId,
	getPortalDestination,
	isBrowser,
	isTouch,
	kbd,
	makeHullFromElements,
	noop,
	pointInPolygon,
	styleToString,
} from "$lib/internal/helpers";
import type { TooltipIds, TooltipProps } from "./types";

// Global map to get the currently open tooltip in a group.
type TooltipGroup = string | true;
const openTooltips = new Map<TooltipGroup, Tooltip>();

type OpenReason = "pointer" | "focus";

export class Tooltip {
	positioning: FloatingConfig = $state(null);
	arrowSize: number = $state(0);
	open: boolean = $state(false);
	closeOnPointerDown: boolean = $state(false);
	openDelay: number = $state(0);
	closeDelay: number = $state(0);
	forceVisible: boolean = $state(false);
	closeOnEscape: boolean = $state(false);
	disableHoverableContent: boolean = $state(false);
	portal: HTMLElement | string | null = $state(null);
	group: string | boolean | null = $state(null);
	ids: TooltipIds = $state({ trigger: "", content: "" });

	constructor(props: TooltipProps = {}) {
		const {
			positioning = { placement: "bottom" },
			arrowSize = 8,
			open = false,
			closeOnPointerDown = false,
			openDelay = 1000,
			closeDelay = 0,
			forceVisible = false,
			closeOnEscape = false,
			disableHoverableContent = false,
			portal = "body",
			group = null,
			ids,
		} = props;

		this.positioning = positioning;
		this.arrowSize = arrowSize;
		this.open = open;
		this.closeOnPointerDown = closeOnPointerDown;
		this.openDelay = openDelay;
		this.closeDelay = closeDelay;
		this.forceVisible = forceVisible;
		this.closeOnEscape = closeOnEscape;
		this.disableHoverableContent = disableHoverableContent;
		this.group = group;
		this.portal = portal;
		this.ids.trigger = ids?.trigger ?? generateId();
		this.ids.content = ids?.content ?? generateId();

		this.createUniqueGroupEffect();
		this.createDocumentMouseMoveEffect();
		this.createFloatingEffect();
	}

	private openReason: OpenReason | null = $state(null);
	private clickedTrigger = false;
	private openTimeout: number | null = null;
	private closeTimeout: number | null = null;
	private isMouseInTooltipArea = false;

	private get isHidden() {
		return !this.open && !this.forceVisible;
	}

	/** Only one tooltip in a group can be open at a time. */
	private createUniqueGroupEffect() {
		$effect(() => {
			const group = this.group;
			if (group === null || group === false) return;

			const cleanup = () => {
				if (openTooltips.get(group) !== this) return;
				openTooltips.delete(group);
			};

			if (!this.open) return cleanup;

			// Replace the currently open tooltip in the group
			// with this tooltip.
			const openTooltip = openTooltips.get(group);
			if (openTooltip && openTooltip !== this) {
				openTooltip.open = false;
			}
			openTooltips.set(group, this);
			return cleanup;
		});
	}

	private createDocumentMouseMoveEffect() {
		$effect(() => {
			if (!this.open) return;
			return addEventListener(document, "mousemove", (e) => {
				const contentEl = this.getEl("content");
				const triggerEl = this.getEl("trigger");
				if (!contentEl || !triggerEl) return;

				const polygonElements = this.disableHoverableContent ? [triggerEl] : [triggerEl, contentEl];
				const polygon = makeHullFromElements(polygonElements);

				this.isMouseInTooltipArea = pointInPolygon(
					{
						x: e.clientX,
						y: e.clientY,
					},
					polygon,
				);

				if (this.openReason !== "pointer" || this.isMouseInTooltipArea) return;
				this.closeTooltip();
			});
		});
	}

	private createFloatingEffect() {
		let unsubFloating = noop;
		let unsubPortal = noop;

		$effect(() => {
			const contentEl = this.getEl("content");
			const triggerEl = this.getEl("trigger");
			if (!triggerEl || !contentEl || this.isHidden) {
				unsubPortal();
				unsubFloating();
				return;
			}

			const floatingReturn = useFloating(triggerEl, contentEl, this.positioning);
			unsubFloating = floatingReturn.destroy;
			if (!this.portal) {
				unsubPortal();
				return;
			}

			const portalDest = getPortalDestination(contentEl, this.portal);
			if (!portalDest) return;

			const portalReturn = usePortal(contentEl, portalDest);
			if (portalReturn && portalReturn.destroy) {
				unsubPortal = portalReturn.destroy;
			}
		});
	}

	private getEl(part: keyof TooltipIds) {
		if (!isBrowser) return null;
		return document.getElementById(this.ids[part]);
	}

	private openTooltip(reason: OpenReason) {
		this.resetCloseTimeout();

		if (this.openTimeout !== null) return;
		this.openTimeout = window.setTimeout(() => {
			this.open = true;
			// Don't override the reason if it's already set.
			this.openReason ??= reason;
			this.openTimeout = null;
		}, this.openDelay);
	}

	private resetCloseTimeout() {
		if (this.closeTimeout === null) return;
		window.clearTimeout(this.closeTimeout);
		this.closeTimeout = null;
	}

	private closeTooltip(isBlur?: boolean) {
		this.resetOpenTimeout();

		if (isBlur && this.isMouseInTooltipArea) {
			// Normally when blurring the trigger, we want to close the tooltip.
			// The exception is when the mouse is still in the tooltip area.
			// In that case, we have to set the openReason to pointer, so that
			// it can close when the mouse leaves the tooltip area.
			this.openReason = "pointer";
			return;
		}

		if (this.closeTimeout !== null) return;
		this.closeTimeout = window.setTimeout(() => {
			this.open = false;
			this.openReason = null;
			if (isBlur) this.clickedTrigger = false;
			this.closeTimeout = null;
		}, this.closeDelay);
	}

	private resetOpenTimeout() {
		if (this.openTimeout === null) return;
		window.clearTimeout(this.openTimeout);
		this.openTimeout = null;
	}

	readonly trigger = this.createTrigger();

	private createTrigger() {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;
		return {
			"data-melt-tooltip-trigger": "",
			get "aria-describedby"() {
				return self.ids.content;
			},
			get id() {
				return self.ids.trigger;
			},
			onkeydown: this.handleTriggerKeydown.bind(this),
			onpointerdown: this.handleTriggerPointerDown.bind(this),
			onpointerenter: this.handleTriggerPointerEnter.bind(this),
			onpointerleave: this.handleTriggerPointerLeave.bind(this),
			onfocus: this.handleTriggerFocus.bind(this),
			onblur: this.handleTriggerBlur.bind(this),
		} as const;
	}

	private handleTriggerKeydown(e: KeyboardEvent) {
		if (!this.closeOnEscape || e.key !== kbd.ESCAPE) return;
		this.resetOpenTimeout();
		this.open = false;
	}

	private handleTriggerPointerDown() {
		if (!this.closeOnPointerDown) return;
		this.open = false;
		this.clickedTrigger = true;
		this.resetOpenTimeout();
	}

	private handleTriggerPointerEnter(e: PointerEvent) {
		if (isTouch(e)) return;
		this.openTooltip("pointer");
	}

	private handleTriggerPointerLeave(e: PointerEvent) {
		if (isTouch(e)) return;
		this.resetOpenTimeout();
	}

	private handleTriggerFocus() {
		if (this.clickedTrigger) return;
		this.openTooltip("focus");
	}

	private handleTriggerBlur() {
		this.closeTooltip(true);
	}

	readonly content = this.createContent();

	private createContent() {
		const hidden = $derived(this.isHidden ? true : undefined);
		const style = $derived(
			styleToString({
				display: hidden ? "none" : undefined,
			}),
		);
		const dataPortal = $derived(this.portal ? "" : undefined);
		const self = this;
		return {
			"data-melt-tooltip-content": "",
			role: "tooltip",
			tabindex: -1,
			get id() {
				return self.ids.content;
			},
			get hidden() {
				return hidden;
			},
			get style() {
				return style;
			},
			get "data-portal"() {
				return dataPortal;
			},
			onpointerenter: this.handleContentPointerEnter.bind(this),
			onpointerdown: this.handleContentPointerDown.bind(this),
		} as const;
	}

	private handleContentPointerEnter() {
		this.openTooltip("pointer");
	}

	private handleContentPointerDown() {
		this.openTooltip("pointer");
	}

	readonly arrow = this.createArrow();

	private createArrow() {
		const style = $derived(this.arrowStyle);
		return {
			"data-arrow": "",
			get style() {
				return style;
			},
		};
	}

	private get arrowStyle() {
		const size = `var(--arrow-size, ${this.arrowSize}px)`;
		return styleToString({
			position: "absolute",
			width: size,
			height: size,
		});
	}
}
