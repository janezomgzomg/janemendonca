const HomeModule = (() => {
  const styles = `
  #Home {display:none;}
  `;

  const template = `
    HOME
  `;

  function construct() {
    const component = {
      id: 'Home',
      bindTo: 'PageBody',
      attrs: {
        name: 'Home',
        class: 'zomg-section'
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

HomeModule.construct();