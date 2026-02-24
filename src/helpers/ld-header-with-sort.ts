import { LitElement, css, html } from 'lit';
import { property, customElement } from 'lit/decorators.js';

@customElement('ld-header-with-sort')
export class LdHeaderWithSort extends LitElement {
  @property({ type: String }) direction: '' | 'asc' | 'desc' = '';

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .layout {
        display: flex;
        flex-direction: row;
        align-items: center;
      }

      .flex {
        flex: 1;
      }

      .sort-btn {
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
      }

      .sort-btn:hover {
        background: rgba(0, 0, 0, 0.08);
      }

      .sort-btn svg {
        width: 18px;
        height: 18px;
        transition: transform 0.2s;
        fill: currentColor;
      }

      .sort-btn.desc svg,
      .sort-btn.asc svg {
        color: var(--lit-datatable-api-arrow-color, var(--paper-light-green-600, #7cb342));
      }

      .sort-btn.asc svg {
        transform: rotate(180deg);
      }
    `;
  }

  render() {
    return html`
      <div class="layout">
        <div class="flex">
          <slot></slot>
        </div>
        <slot name="actions"></slot>
        <button
          class="sort-btn ${this.direction}"
          title="${this.getTooltipText(this.direction)}"
          @click="${this.handleSort}">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/>
          </svg>
        </button>
      </div>
    `;
  }

  handleSort() {
    switch (this.direction) {
      case '':
        this.direction = 'desc';
        break;
      case 'desc':
        this.direction = 'asc';
        break;
      default:
        this.direction = '';
        break;
    }
    this.dispatchEvent(new CustomEvent('direction-changed', { detail: { value: this.direction } }));
  }

  getTooltipText(direction: 'asc' | 'desc' | '') {
    if (direction === 'asc') return 'Cancel sort';
    if (direction === 'desc') return 'Sort A-Z';
    return 'Sort Z-A';
  }
}
