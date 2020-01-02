const COMPONENTS = (() => {
  const loadComponents = (app, componentsList) => {
    componentsList.forEach((component) => {
      app.appendChild(loadComponent(component));
    });
  };

  const loadComponent = ({id, path}) => {
    let component = document.createElement('script');
    component.src = path;
    return component;
  };

  const loadStyles = (styles) => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles));
    return style;
  }

  const getComponent = (componentId) => {
    return ZomgUtil.find(APP_COMPONENTS, 'id', componentId);
  }

  const getComponentId = (componentId) => {
    return getComponent(componentId)['id'];
  };

  const getComponentPath = (componentId) => {
    return getComponent(componentId)['path'];
  };

  const getComponentParent = (componentId) => {
    return getComponent(componentId)['parent'];
  };

  const renderComponent = ({id, bindTo, attrs, template, styles}) => {
    return new Promise((resolve, reject) => {
      return setTimeout(() => {
        const parentContainer = document.getElementById(bindTo);
        const component = createComponent(id, attrs, template, styles);
        parentContainer.appendChild(component);
        return resolve();
      }, 0);
    });
  };
  
  const createComponent = ((id, attrs, template, styles) => {
    const component = document.createElement('div');
    component.setAttribute('id', id);
    if(attrs) {
      Object.keys(attrs).forEach((property) => {
        component.setAttribute(property, attrs[property]);
      });
    }
    component.innerHTML = template;
    if(styles) {
      component.appendChild(loadStyles(styles));
    }
    return component;
  });


  return {
    loadComponents,
    loadComponent,
    getComponent,
    getComponentId,
    getComponentPath,
    getComponentParent,
    renderComponent
  }
})();