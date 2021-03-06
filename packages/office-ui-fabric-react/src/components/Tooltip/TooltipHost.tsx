/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */
import {
  BaseComponent,
  autobind,
  css,
  divProperties,
  getNativeProps,
  getId,
  assign,
  hasOverflow
} from '../../Utilities';
import { ITooltipHostProps, TooltipOverflowMode } from './TooltipHost.Props';
import { Tooltip } from './Tooltip';
import { TooltipDelay } from './Tooltip.Props';

import * as stylesImport from './TooltipHost.scss';
const styles: any = stylesImport;

export interface ITooltipHostState {
  isTooltipVisible?: boolean;
}

export class TooltipHost extends BaseComponent<ITooltipHostProps, ITooltipHostState> {
  public static defaultProps = {
    delay: TooltipDelay.medium
  };

  // The wrapping div that gets the hover events
  private _tooltipHost: HTMLElement;

  // Constructor
  constructor(props: ITooltipHostProps) {
    super(props);

    this.state = {
      isTooltipVisible: false
    };
  }

  // Render
  public render() {
    const { calloutProps, content, children, directionalHint, delay, id } = this.props;
    const { isTooltipVisible } = this.state;
    const tooltipId = id || getId('tooltip');
    return (
      <div
        className={ css('ms-TooltipHost', styles.host) }
        ref={ this._resolveRef('_tooltipHost') }
        { ...{ onFocusCapture: this._onTooltipMouseEnter } }
        { ...{ onBlurCapture: this._onTooltipMouseLeave } }
        onMouseEnter={ this._onTooltipMouseEnter }
        onMouseLeave={ this._onTooltipMouseLeave }
        aria-describedby={ isTooltipVisible ? tooltipId : undefined }
      >
        { children }
        { isTooltipVisible && (
          <Tooltip
            id={ tooltipId }
            delay={ delay }
            content={ content }
            targetElement={ this._getTargetElement() }
            directionalHint={ directionalHint }
            calloutProps={ assign(calloutProps, { onDismiss: this._onTooltipCallOutDismiss }) }
            { ...getNativeProps(this.props, divProperties) }
          >
          </Tooltip>
        ) }
      </div>
    );
  }

  private _getTargetElement(): HTMLElement {
    const { overflowMode } = this.props;

    // Select target element based on overflow mode. For parent mode, you want to position the tooltip relative
    // to the parent element, otherwise it might look off.
    if (overflowMode !== undefined) {
      switch (overflowMode) {
        case TooltipOverflowMode.Parent:
          return this._tooltipHost.parentElement;

        case TooltipOverflowMode.Self:
          return this._tooltipHost;
      }
    }

    return this._tooltipHost;
  }

  // Show Tooltip
  @autobind
  private _onTooltipMouseEnter(ev: any) {
    const { overflowMode } = this.props;

    if (overflowMode !== undefined) {
      const overflowElement = this._getTargetElement();
      if (overflowElement && !hasOverflow(overflowElement)) {
        return;
      }
    }

    this.setState({
      isTooltipVisible: true
    });
  }

  // Hide Tooltip
  @autobind
  private _onTooltipMouseLeave(ev: any) {
    this.setState({
      isTooltipVisible: false
    });
  }

  // Hide Tooltip
  @autobind
  private _onTooltipCallOutDismiss() {
    this.setState({
      isTooltipVisible: false
    });
  }
}
