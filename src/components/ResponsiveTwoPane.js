import React, { Component } from 'react';
import Sidebar from 'react-sidebar';

const mql = window.matchMedia(`(min-width: 800px)`);

class ResponsiveTwoPane extends Component {
  constructor(props) {
    super(props);

    const { docked, open } = props;
    this.state = { docked, open };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  onSetSidebarOpen(open) {
    this.setState({ open });
  }

  componentWillMount() {
    this.mediaQueryChanged();
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  mediaQueryChanged() {
    this.setState({ docked: mql.matches });
  }

  render() {
    const { onSetSidebarOpen } = this;
    const { sidebar, children, options } = this.props;
    const { open, docked } = this.state;

    const childProps = { onSetSidebarOpen, sidebarOpen: open, sidebarDocked: docked };

    return (
      <Sidebar
        sidebar={ React.cloneElement(sidebar, childProps) }
        open={open}
        docked={docked}
        onSetOpen={this.onSetSidebarOpen}
        { ...options }>

        { React.cloneElement(children, childProps) }
      </Sidebar>
    );
  }
}

export default ResponsiveTwoPane;
