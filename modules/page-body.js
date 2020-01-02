const PageBodyModule = (() => {
  const styles = `
    .zomg-page-body {
      height: calc(100% - 135px);
      padding: 16px;
    }

    .zomg-section {
      border: solid 5px red;
      background: var(--candy-apple-red);
      margin: 16px 0;
      padding: 32px;
    }
  `;

  const template = `
    <div class="zomg-page-body">
      <div class="zomg-section" id="section-home"></div>
      <div class="zomg-section" id="section-resume">

      </div>
      <div class="zomg-section" id="section-blog"></div>
    </div>
  `;

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