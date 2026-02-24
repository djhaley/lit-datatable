import {
  LitElement, css, html
} from 'lit';
import { property, customElement } from 'lit/decorators.js';

type FooterPosition = 'right' | 'left';

@customElement('lit-datatable-footer')
export class LitDatatableFooter extends LitElement {
  @property({ type: String }) footerPosition: FooterPosition = 'left';

  @property({ type: Number }) size = 0;

  @property({ type: Number }) page = 0;

  @property({ type: Number }) totalElements = 0;

  @property({ type: Number }) totalPages = 0;

  @property({ type: Array }) availableSize: Array<number> = [];

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .foot {
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 12px;
        font-weight: normal;
        height: 55px;
        border-top: 1px solid;
        border-color: var(--lit-datatable-divider-color, rgba(0, 0, 0, 0.12));
        padding: 0 14px 0 0;
        color: var(--lit-datatable-footer-color, rgba(0, 0, 0, 0.54));
      }

      .left {
        padding: 0 0 0 14px;
      }

      .end-justified {
        margin-left: auto;
      }

      .controls {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .size-controls {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 4px;
      }

      .status {
        margin: 0 8px 0 32px;
      }

      select {
        width: 64px;
        text-align: right;
        font-size: 12px;
        font-weight: 500;
        color: var(--lit-datatable-footer-color, rgba(0, 0, 0, 0.54));
        background: var(--lit-datatable-footer-background, white);
        border: none;
        outline: none;
        cursor: pointer;
        appearance: none;
        -webkit-appearance: none;
        padding: 0 4px 0 0;
      }

      .nav-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        margin-left: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--lit-datatable-footer-color, rgba(0, 0, 0, 0.54));
        border-radius: 50%;
      }

      .nav-btn:hover:not(:disabled) {
        background: rgba(0, 0, 0, 0.08);
      }

      .nav-btn:disabled {
        opacity: 0.38;
        cursor: default;
      }

      .nav-btn svg {
        width: 20px;
        height: 20px;
        fill: currentColor;
      }
    `;
  }

  render() {
    return html`
      <div class="foot">
        <div class="${this.footerPosition} ${this.computePosition(this.footerPosition)}">
          <div class="controls">
            <div class="size-controls">
              <span>Lines per page</span>
              <select .value="${String(this.size)}" @change="${this.newSizeIsSelected}">
                ${this.availableSize && this.availableSize.map((s) => html`
                  <option value="${s}" ?selected="${s === this.size}">${s}</option>
                `)}
              </select>
            </div>
            <div class="status">
              ${this.computeCurrentSize(this.page, this.size, this.totalElements)}-${this.computeCurrentMaxSize(this.page, this.size, this.totalElements)}
              of
              ${this.totalElements}
            </div>
            <button
              class="nav-btn"
              title="Previous page"
              .disabled="${this.prevButtonDisabled(this.page)}"
              @click="${this.prevPage}">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <button
              class="nav-btn"
              title="Next page"
              .disabled="${this.nextButtonDisabled(this.page, this.totalPages)}"
              @click="${this.nextPage}">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  computeCurrentSize(page: number, size: number, totalElements: number) {
    if (totalElements) {
      return (page * size) + 1;
    }
    return 0;
  }

  computeCurrentMaxSize(page: number, size: number, totalElements: number) {
    const maxSize = size * (page + 1);
    return maxSize > totalElements ? totalElements : maxSize;
  }

  launchEvent() {
    this.dispatchEvent(new CustomEvent('page-or-size-changed', { detail: { page: this.page, size: this.size } }));
  }

  nextPage() {
    if (this.page + 1 < this.totalPages) {
      this.page += 1;
      this.launchEvent();
    }
  }

  prevPage() {
    if (this.page > 0) {
      this.page -= 1;
      this.launchEvent();
    }
  }

  nextButtonDisabled(page: number, totalPages: number) {
    return totalPages === 0 || page + 1 === totalPages;
  }

  prevButtonDisabled(page: number) {
    return page === 0;
  }

  newSizeIsSelected(e: Event) {
    const select = e.target as HTMLSelectElement;
    const newSize = parseInt(select.value, 10);
    if (!isNaN(newSize) && newSize !== this.size) {
      this.page = 0;
      this.size = newSize;
      this.launchEvent();
    }
  }

  computePosition(position: FooterPosition) {
    return position === 'right' ? 'end-justified' : '';
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'lit-datatable-footer': LitDatatableFooter;
  }
}
