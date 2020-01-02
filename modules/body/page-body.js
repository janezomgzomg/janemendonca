const PageBodyModule = (() => {
  const styles = `
    .zomg-page-body {
      height: calc(100% - 135px);
      padding: 16px;
    }
    .zomg-section {
      background: var(--candy-apple-red);
      height: 100%;
    }
  `;
  const template = '';

  function construct() {
    const component = {
      id: 'PageBody',
      bindTo: 'janezomgzomg',
      attrs: {
        name: 'PageBody',
        class: 'zomg-page-body'
      },
      template,
      styles
    };
    COMPONENTS.renderComponent(component);
  }
  return {
    construct
  }
})();

PageBodyModule.construct();