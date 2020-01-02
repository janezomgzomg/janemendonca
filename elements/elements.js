const Elements = ((type) => {

  const renderElement= (parent, properties) => {
    let parentContainer = document.getElementById(parent);
    parentContainer.appendChild(APP_ELEMENTS[type].element(properties));
    parentContainer.appendChild(renderElementStyles(APP_ELEMENTS[type].styles()));
  };

  const renderElementStyles = (styles) => {
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(styles));
    return style;
  };

  return {
    renderElement
  }
});

const APP_ELEMENTS = {
  'menu': {
    element: ({items}) => {

      const clickMenuTab = (event) => {
        clearSelectedTab().then(() => {
          event.target.classList.add('selected');
        });
      };

      const clearSelectedTab = () => {
        return new Promise((resolve, reject) => {
          let elements = [...document.getElementsByClassName('selected')];
          for(let i = 0; i<elements.length; i++) {
            elements[i].classList.remove('selected');
          }
          return resolve();
        });
      }

      const createMenu = (itemsList) => {
        const ul = document.createElement('ul');
        ul.classList.add('menu');

        itemsList.forEach((item) => {
          const menuItem = document.createElement('li');
          menuItem.addEventListener('click', clickMenuTab);
          menuItem.setAttribute('id', item.id);
          menuItem.textContent = item.label;
          if(item.selected) {
            menuItem.classList.add('selected');
          }
          ul.appendChild(menuItem);
        });
        return ul;
      }

      return createMenu(items);
    },
    styles: () => {
      return `
        ul.menu {
          display: flex;
        }

        ul.menu li {
          display: flex;
          align-self: center;
          padding: 0 8px;
          cursor: pointer;
        }

        ul.menu li:first-of-type {
          padding-left: 16px;
        }

        ul.menu li:last-of-type {
          padding-right: 16px;
        }
      `;
    }
  }
}