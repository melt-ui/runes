import { isElement } from "$lib/internal/helpers/index.js";
import { useInteractOutside } from "../index.js";
import type { ModalConfig } from "./types.js";

const visibleModals: HTMLElement[] = [];

function removeFromVisibleModals(node: HTMLElement) {
	const index = visibleModals.indexOf(node);
	if (index >= 0) {
		visibleModals.splice(index, 1);
	}
}

function isLastModal(node: HTMLElement) {
	return node === visibleModals.at(-1);
}

export function useModal(node: HTMLElement, config: ModalConfig) {
	const { open, onClose, closeOnInteractOutside = false, shouldCloseOnInteractOutside } = config;

	setTimeout(() => {
		if (open) {
			visibleModals.push(node);
		} else {
			removeFromVisibleModals(node);
		}
	}, 100);

	if (!open) {
		return;
	}

	useInteractOutside(node, {
		onInteractOutsideStart(event) {
			const target = event.target;
			if (!isElement(target) || !isLastModal(node)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();
		},
		onInteractOutside(event) {
			// We only want to call `onClose` if this is the topmost modal
			if (!closeOnInteractOutside || !isLastModal(node)) {
				return;
			}

			if (shouldCloseOnInteractOutside !== undefined && !shouldCloseOnInteractOutside(event)) {
				return;
			}

			event.preventDefault();
			event.stopPropagation();
			event.stopImmediatePropagation();

			if (onClose !== undefined) {
				onClose();
				visibleModals.pop();
			}
		},
	});
}
