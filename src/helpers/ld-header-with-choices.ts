import {
  LitElement, css, html, PropertyValues, TemplateResult
} from 'lit';
import { property, customElement, query } from 'lit/decorators.js';

import './ld-header-with-sort';

export interface Choice {
  key: string;
  label: string;
  style?: string;
  icon?: string;
  iconStyle?: string;
  prefix?: TemplateResult;
}

@customElement('ld-header-with-choices')
export class LdHeaderWithChoices extends LitElement {
  @property({ type: Array }) choices: Array<Choice> = [];

  @property({ type: Boolean }) enableFilter = false;

  @property({ type: String }) filterValue = '';

  @query('#filterInput') filterInput!: HTMLInputElement;

  @property({ type: Array }) filteredChoices: Array<Choice> = [];

  @property({ type: Array }) selectedChoices: Array<string> = [];

  @property({ type: String }) property = '';

  @property({ type: Boolean }) opened = false;

  @query('.dropdown') dropdown!: HTMLDivElement;

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
        display: flex;
        flex-direction: row;
      }

      .dropdown {
        position: fixed;
        background: var(--ld-header-with-choices-background-color, white);
        transform-origin: 50% 0;
        transition: transform 0.1s;
        transform: scaleY(1);
        box-shadow: var(--ld-header-with-choices-box-shadown, 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24));
        width: var(--dt-dropdown-choice-dropdown-width, max-content);
        z-index: 99;
        max-height: 300px;
        overflow: auto;
        margin: var(--dt-dropdown-choice-dropdown-margin, 0);
        color: var(--primary-text-color, black);
        border-radius: var(--dt-dropdown-choice-dropdown-border-radius, 0);
      }

      .dropdown.hide {
        transform: scaleY(0);
      }

      .choice-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
      }

      .choice-row:hover {
        background: rgba(0, 0, 0, 0.04);
      }

      .checkbox-btn {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
        min-width: 40px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .checkbox-btn svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }

      .checkbox-btn.checked {
        color: var(--paper-datatable-api-checked-checkbox-color, var(--primary-color, #1E73BE));
      }

      .checkbox-btn.unchecked {
        color: var(--paper-datatable-api-unchecked-checkbox-color, var(--primary-text-color, black));
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

      .selected {
        color: var(--primary-color, #1E73BE);
        font-style: italic;
        margin-left: 4px;
      }

      .choice-icon {
        margin-left: 24px;
      }

      .choice-icon svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }

      .label {
        font-size: 13px;
        font-family: Roboto, sans-serif;
        font-weight: 400;
        margin-right: 16px;
      }

      .prefix {
        margin-right: 10px;
      }

      #search-container {
        padding: 6px 6px 6px 10px;
        border-bottom: 1px solid #E0E0E0;
        display: flex;
        align-items: center;
      }

      #search-container input {
        border: none;
        font-size: var(--header-filter-input-font-size, 16px);
        width: calc(100% - 30px);
        outline: none;
        background: transparent;
        height: 24px;
        padding: 0;
        color: var(--dt-input-text-color, black);
        box-shadow: none;
        min-width: 0;
      }
    `;
  }

  render() {
    return html`
      <div class="layout">
        <div class="layout">
          <span class="flex">
            <slot></slot>
            ${this.selectedChoices && this.selectedChoices.length > 0 ? html`
              <div class="selected">
                ${this.countSelected(this.selectedChoices)}
              </div>` : null}
          </span>
          <button class="icon-btn" title="Open" @click="${this.openDropdown}">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </button>
        </div>

        <div class="dropdown">
          ${this.enableFilter ? html`
            <div id="search-container">
              <input id="filterInput"
                @input="${this.filterValueChanged}"
                @change="${this.filterValueChanged}"
                .value="${this.filterValue}" />
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style="width:18px;height:18px;fill:currentColor;flex-shrink:0">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
            </div>
          ` : null}
          ${this.filteredChoices && this.filteredChoices.map((choice) => html`
            <div class="choice-row" @click="${() => this.tapChoice(choice.key)}">
              <button class="checkbox-btn ${this.isSelected(choice.key) ? 'checked' : 'unchecked'}">
                ${this.isSelected(choice.key) ? html`
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                ` : html`
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                `}
              </button>
              ${choice.prefix ? html`<div class="prefix">${choice.prefix}</div>` : null}
              <div class="label" .style="${choice.style ?? ''}">
                ${choice.label}
              </div>
              ${choice.icon ? html`
                <div class="choice-icon" .style="${choice.iconStyle ?? ''}">
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <use href="#${choice.icon}"/>
                  </svg>
                </div>
              ` : null}
            </div>
          `)}
        </div>
      </div>
    `;
  }

  constructor() {
    super();
    this.selectedChoices = [];
    this.opened = false;
  }

  isSelected(key: string) {
    return this.selectedChoices.indexOf(key) !== -1;
  }

  countSelected(selectedChoices: Array<string>) {
    return selectedChoices.length > 0 ? ` (${selectedChoices.length})` : '';
  }

  tapChoice(name: string) {
    const selectedChoices = [...this.selectedChoices];
    const indexOfChoice = selectedChoices.indexOf(name);
    if (indexOfChoice === -1) {
      selectedChoices.push(name);
    } else {
      selectedChoices.splice(indexOfChoice, 1);
    }
    this.dispatchEvent(new CustomEvent(
      'selected-choices-changed',
      { detail: { value: selectedChoices, property: this.property } }
    ));
  }

  updated(properties: PropertyValues<LdHeaderWithChoices>) {
    if (properties.has('opened')) {
      if (this.opened) {
        this.dropdown.classList.remove('hide');
        if (this.enableFilter) {
          this.filterInput.focus();
          this.filterValue = '';
        }
      } else {
        this.dropdown.classList.add('hide');
      }
      this.fitToBorder();
    }
    if (properties.has('enableFilter') || properties.has('choices') || properties.has('filterValue')) {
      this.updateFilteredChoices();
    }
  }

  openDropdown() {
    this.opened = !this.opened;
  }

  fitToBorder() {
    if (this.shadowRoot) {
      if (this.dropdown) {
        this.dropdown.style.left = '0';
        const dropdownWidth = this.dropdown.offsetWidth;
        const viewPortWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
        const thisX = this.getBoundingClientRect().x;
        const thisY = this.getBoundingClientRect().y;
        if ((dropdownWidth + thisX) > viewPortWidth) {
          this.dropdown.style.left = `${viewPortWidth - dropdownWidth}px`;
        } else {
          this.dropdown.style.left = `${thisX}px`;
        }
        this.dropdown.style.top = `${thisY + this.offsetHeight + 9}px`;
      }
    }
  }

  firstUpdated() {
    window.addEventListener('resize', () => {
      this.fitToBorder();
    });
    window.addEventListener('keyup', (event) => {
      if (this.opened && event.key === 'Escape') {
        this.opened = false;
      }
    });
    window.addEventListener('click', (event) => {
      const path = event.composedPath && event.composedPath();
      if (path.includes(this)) {
        event.preventDefault();
      } else if (this.opened) {
        this.opened = false;
      }
    });
  }

  filterValueChanged(event: InputEvent) {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    this.filterValue = target.value;
  }

  updateFilteredChoices() {
    this.filteredChoices = (this.enableFilter && this.choices)
      ? this.choices.filter((c) => c?.label?.toLowerCase().includes(this.filterValue?.toLowerCase()))
      : this.choices;
  }
}
