import * as React from 'react';

/**
 * the not found page
 */
export class NotFound extends React.Component<{}, {}> {
  /**
   * render the components
   * @returns {XML}
   */
  render() {
    return (
      <div className="collapsed">
        <div className="app-container">
          <h1>The requested URL {window.location.pathname} was not found on this server.</h1>
          <div className="app-content">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
