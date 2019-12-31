const HeaderMenuModule = (() => {
  const styles = `
    .zomg-header-menu ul.menu {
      height: 40px;
      background: var(--candy-apple-red);
    }
    .zomg-header-menu ul.menu li {
      color: var(--yellow);
      transition: background 0.20s ease-in, color 0.20s ease-in;
    }
    .zomg-header-menu ul.menu li:hover {
      background: var(--brown);
    }
    .zomg-header-menu ul.menu li:active, .zomg-header-menu ul.menu li.selected {
      background: var(--white);
      color: var(--candy-apple-red);
    }
  `;

  const menu = {
    items: [
      {id: 'menu-home', label: 'Home', selected: true},
      {id: 'menu-resume', label: 'Resume'},
      {id: 'menu-blog', label: 'Blog'},
    ]
  };

  function construct() {
    const component = {
      id: 'HeaderMenu',
      bindTo: 'PageHeader',
      attrs: {
        name: 'HeaderMenu',
        class: 'zomg-header-menu'
      },
      template: '',
      styles
    };
    COMPONENTS.renderComponent(component);
    Elements('menu').renderElement('HeaderMenu', menu);
  }
  return {
    construct
  }
})();

HeaderMenuModule.construct();