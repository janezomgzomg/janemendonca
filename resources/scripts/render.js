function renderElement(schema, data = '') {
  let element = document.createElement(schema.type);
  element.setAttribute('id', `${schema.type}-${schema.id || data}`);
  if(schema.attrs) {
    setElementAttributes(element, schema.attrs);
  }
  if(schema.properties) {
    setElementProperties(element, schema.properties);
  }
  if(data) {
    element.innerHTML = data;
  }
  return element;
}

function setElementAttributes(element, attrs) {
  Object.keys(attrs).forEach((key) => {
    element.setAttribute(key, attrs[key]);
  });
}

function setElementProperties(element, properties) {
  properties.forEach(({type, value}) => {
    element.appendChild(renderProperty(type, value));
  })
}

function renderProperty(type, value) {
  return renderElement(elementTypes[type], value);
}