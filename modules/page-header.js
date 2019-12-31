const PageHeaderModule = (() => {
  const styles = `
    .zomg-page-header {
      font-weight: bold;
      display: flex;
      align-items: stretch;
      flex-direction: column;
    }
    .zomg-header {
      background: var(--brown);
      padding: 0 16px;
      height: 60px;
      display: flex;
        align-items: center;
    }
    .zomg-header h1 {
      margin: 0;
      color: var(--yellow);
    }
  `;
  
  const template = `
    <div class="zomg-header">
      <h1>Jane Mendonça</h1>
    </div>
  `;

  function construct() {
    const component = {
      id: 'PageHeader',
      bindTo: 'janezomgzomg',
      attrs: {
        name: 'PageHeader',
        class: 'zomg-page-header'
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

PageHeaderModule.construct();