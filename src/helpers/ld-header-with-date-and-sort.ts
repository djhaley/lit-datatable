import {
  LitElement, css, html, PropertyValues
} from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import '@doubletrade/lit-datepicker/lit-datepicker-input';
import './ld-header-with-sort';

@customElement('ld-header-with-date-and-sort')
export class LdHeaderWithDateAndSort extends LitElement {
  @property({ type: String }) header = '';

  @property({ type: String }) dateFormat = '';

  @property({ type: String }) property = '';

  @property({ type: String }) direction: '' | 'asc' | 'desc' = '';

  @property({ type: Boolean }) active = false;

  @property({ type: String }) dateFrom: string | null = null;

  @property({ type: String }) dateTo: string | null = null;

  @property({ type: Boolean }) noRange = false;

  @property({ type: String }) horizontalAlign: 'left' | 'right' = 'right';

  @query('input') inputEl!: HTMLInputElement;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .actions {
        padding-left: 8px;
      }

      .date-row {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        min-width: 24px;
        min-height: 24px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--paper-icon-button-color, inherit);
        border-radius: 50%;
        flex-shrink: 0;
      }

      .icon-btn:hover {
        color: var(--paper-icon-button-color-hover, inherit);
        background: rgba(0, 0, 0, 0.08);
      }

      .icon-btn svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }

      input {
        min-width: var(--paper-datatable-api-min-width-input-filter, 120px);
        border: none;
        border-bottom: 1px solid rgba(0, 0, 0, 0.42);
        outline: none;
        font-size: 12px;
        padding: 2px 0;
        background: transparent;
        color: inherit;
      }

      input:focus {
        border-bottom-color: var(--lit-datatable-focus-color, #1976d2);
      }
    `;
  }

  render() {
    const inputTpl = (dateFrom: string, dateTo: string, noRange: boolean) => html`
      <input
        placeholder="${this.header}"
        .value="${this.computeDate(dateFrom, dateTo, noRange)}"
        readonly>
    `;

    if (this.active) {
      return html`
        <ld-header-with-sort
          @direction-changed="${this.directionChanged}"
          .direction="${this.direction}">
          <div class="date-row">
            <lit-datepicker-input
              .html="${inputTpl}"
              .noRange="${this.noRange}"
              .horizontalAlign="${this.horizontalAlign}"
              .dateFormat="${this.dateFormat}"
.dateFrom="${this.dateFrom}"
              .dateTo="${this.dateTo}"
              @date-from-changed="${this.dateFromChanged}"
              @date-to-changed="${this.dateToChanged}"
              forceNarrow>
            </lit-datepicker-input>
            <button class="icon-btn" title="Clear" @click="${this.clearDate}">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
        </ld-header-with-sort>
      `;
    }

    return html`
      <ld-header-with-sort
        @direction-changed="${this.directionChanged}"
        .direction="${this.direction}">
        <div @click="${this.toggleActive}">
          ${this.header}
        </div>
        <div class="actions" slot="actions">
          <button class="icon-btn" title="Pick date" @click="${this.toggleActive}">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/>
            </svg>
          </button>
        </div>
      </ld-header-with-sort>
    `;
  }

  updated(properties: PropertyValues) {
    if (properties.has('direction')) {
      this.dispatchEvent(new CustomEvent('direction-changed', { detail: { value: this.direction } }));
    }

    if (properties.has('active')) {
      this.dispatchEvent(new CustomEvent('active-changed', { detail: { value: this.active } }));
    }
  }

  dateToChanged({ detail }: CustomEvent<{value: string}>) {
    if (this.dateFrom && detail.value) {
      this.dateTo = detail.value;
      this.dispatchEvent(new CustomEvent('filter', {
        detail: {
          dateFrom: parseInt(this.dateFrom, 10),
          dateTo: parseInt(detail.value, 10),
          property: this.property,
        },
      }));
    }
  }

  dateFromChanged({ detail }: CustomEvent<{value: string}>) {
    if (detail.value) {
      this.dateFrom = detail.value;
      if (this.noRange) {
        this.dispatchEvent(new CustomEvent('filter', {
          detail: {
            dateFrom: parseInt(detail.value, 10),
            property: this.property,
          },
        }));
      }
    }
  }

  async toggleActive() {
    this.active = !this.active;
    if (!this.active) {
      this.dateFrom = null;
      this.dateTo = null;
    }
    await this.updateComplete;
    if (this.inputEl) {
      this.inputEl.focus();
    }
  }

  computeDate(dateFrom: string | null, dateTo: string | null, noRange: boolean) {
    if (dateFrom && dateTo) {
      return `${dateFrom} ${dateTo}`;
    }
    if (noRange && dateFrom) {
      return dateFrom;
    }
    return '';
  }

  clearDate() {
    this.toggleActive();
    this.dispatchEvent(new CustomEvent('filter', {
      detail: {
        dateFrom: null,
        dateTo: null,
        property: this.property,
      },
    }));
  }

  directionChanged({ detail }: CustomEvent<{value: '' | 'asc' | 'desc'}>) {
    this.direction = detail.value;
  }
}
