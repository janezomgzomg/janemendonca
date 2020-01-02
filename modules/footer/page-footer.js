const PageFooterModule = (() => {
  const styles = `
    .zomg-page-footer .link-menu {
      display: flex;
      height: 35px;
    }
    .zomg-page-footer .link-menu li {
      display: flex;
      align-self: center;
      padding: 0 4px;
      opacity: 0.5;
      cursor: pointer;
      transition: opacity 0.20s ease-in;
    }
    .zomg-page-footer .link-menu .icon {
      background-size: 16px;
      background-repeat: no-repeat;
      background-position: center;
      height: 16px;
      width: 16px;
    }
    .zomg-page-footer .link-menu li:first-of-type {
      padding-left: 16px;
    }
    .zomg-page-footer .link-menu li:hover, .zomg-page-footer ul.icon-menu li:active {
      opacity: 1;
    }
    .icon.github {
      background-image: url(resources/icons/github.svg);
    }
    .icon.linkedin {
      background-image: url(resources/icons/linkedin.svg);
    }

  `;
  const template = `
    <ul class='link-menu'>
      <li class="icon github" onclick="openLink('https://github.com/janezomgzomg')"></li>
      <li class="icon linkedin" onclick="openLink('https://www.linkedin.com/in/jane-mendonca-ab218a43/')"></li>
    </ul>
  `;

  function construct() {
    const component = {
      id: 'PageFooter',
      bindTo: 'janezomgzomg',
      attrs: {
        name: 'PageFooter',
        class: 'zomg-page-footer'
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

PageFooterModule.construct();


function openLink(link) {
  window.open(link, '_blank');
}