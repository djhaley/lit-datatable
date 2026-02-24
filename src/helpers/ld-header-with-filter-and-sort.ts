import { LitElement, css, html } from 'lit';
import { property, customElement, query } from 'lit/decorators.js';
import './ld-header-with-sort';

@customElement('ld-header-with-filter-and-sort')
export class LdHeaderWithFilterAndSort extends LitElement {
  @property({ type: String }) header = '';

  @property({ type: String }) direction: '' | 'asc' | 'desc' = '';

  @property({ type: Boolean }) active = false;

  @property({ type: String }) filterValue: string | null = null;

  @property({ type: String }) property = '';

  @query('input') inputEl!: HTMLInputElement;

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .header {
        margin-right: 16px;
        cursor: pointer;
      }

      .icon-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: inherit;
        border-radius: 50%;
        flex-shrink: 0;
      }

      .icon-btn:hover {
        background: rgba(0, 0, 0, 0.08);
      }

      .icon-btn svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }

      .filter-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
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
        flex: 1;
      }

      input:focus {
        border-bottom-color: var(--lit-datatable-focus-color, #1976d2);
      }
    `;
  }

  render() {
    const content = this.active ? html`
      <div class="filter-row">
        <input
          .value="${this.filterValue ?? ''}"
          placeholder="${this.header}"
          @input="${this.valueChanged}">
        <button class="icon-btn" title="Clear" slot="suffix" @click="${this.toggleActive}">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    ` : html`
      <div class="header" @click="${this.toggleActive}">${this.header}</div>
      <button class="icon-btn" slot="actions" title="Search" @click="${this.toggleActive}">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </button>
    `;

    return html`
      <ld-header-with-sort
        .direction="${this.direction}"
        @direction-changed="${this.directionChanged}">
        ${content}
      </ld-header-with-sort>`;
  }

  async toggleActive() {
    this.active = !this.active;
    this.dispatchEvent(new CustomEvent('active-changed', { detail: { value: this.active } }));
    if (!this.active && this.filterValue) {
      this.filterValue = null;
      this.dispatchFilterEvent();
    } else {
      await this.updateComplete;
      this.inputEl?.focus();
    }
  }

  directionChanged({ detail }: CustomEvent<{value: '' | 'asc' | 'desc'}>) {
    if (this.direction !== detail.value) {
      this.direction = detail.value;
      this.dispatchEvent(new CustomEvent('direction-changed', { detail: { value: this.direction } }));
    }
  }

  valueChanged(e: InputEvent) {
    const value = (e.target as HTMLInputElement).value;
    if (this.filterValue !== value) {
      this.filterValue = value;
      this.dispatchFilterEvent();
    }
  }

  dispatchFilterEvent() {
    this.dispatchEvent(new CustomEvent('filter-value-changed', { detail: { value: this.filterValue, property: this.property } }));
  }
}
