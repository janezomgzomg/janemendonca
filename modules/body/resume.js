const ResumeModule = (() => {
  const styles = `
  `;

  const template = `
    RESUME
  `;

  function construct() {
    const component = {
      id: 'Resume',
      bindTo: 'PageBody',
      attrs: {
        name: 'Resume',
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

ResumeModule.construct();