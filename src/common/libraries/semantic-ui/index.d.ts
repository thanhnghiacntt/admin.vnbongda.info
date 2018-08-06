/**
 * add function for semantic UI
 */
interface JQuery {

  /**
   * show the modal
   * @param options
   */
  modal(options: {
    detachable?: boolean,
    autofocus?: boolean,
    observeChanges?: boolean,
    allowMultiple?: boolean,
    keyboardShortcuts?: boolean,
    offset?: boolean,
    context?: JQuery | HTMLElement,
    closable?: boolean,
    transition?: string,
    duration?: number,
    queue?: boolean,
    onShow?(),
    onVisible?(),
    onHide?(data: HTMLElement),
    onHidden?(),
    onApprove?(source: HTMLElement),
    onDeny?(source: HTMLElement)
  } | "show" | "hide"): JQuery;
}
