const HEADER_COMPONENTS = [
  {
    id: 'PageHeader',
    path:'modules/header/page-header.js',
    parent: 'janezomgzomg'
  },
  {
    id: 'HeaderMenu',
    path: 'modules/header/header-menu.js',
    parent: 'PageHeader'
  }
];
const BODY_COMPONENTS = [
  {
    id: 'PageBody',
    path: 'modules/body/page-body.js',
    parent: 'janezomgzomg'
  },
  {
    id: 'Home',
    path: 'modules/body/home.js',
    parent: 'PageBody'
  },
  {
    id: 'Resume',
    path: 'modules/body/resume.js',
    parent: 'PageBody'
  }
];
const FOOTER_COMPONENTS = [
  {
    id: 'PageFooter',
    path: 'modules/footer/page-footer.js',
    parent: 'janezomgzomg'
  }
];

const APP_COMPONENTS = [
  ...HEADER_COMPONENTS,
  ...BODY_COMPONENTS,
  ...FOOTER_COMPONENTS
];