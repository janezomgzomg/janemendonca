// import PageHeaderModule from 'components/page-header/page-header.module.js';

function init() {
}



// function setDefaultView() {
//   setView('resume');
// }
// function clickMenuTab(tab) {
//   clearCurrentView().then(() => {
//     setView(tab);
//   });
// }
// function setView(view) {
//   setTab(view);
//   setSection(view);
// }
// function setSection(view) {
//   document.getElementById(`section-${view}`).classList.add('selected');
//   if(view === 'resume') {
//     renderResume();
//   }
// }
// function setTab(view) {
//   document.getElementById(`menu-${view}`).classList.add('selected');
// }

// function clearCurrentView() {
//   return new Promise((resolve, reject) => {
//     let elements = [...document.getElementsByClassName('selected')];
//     for(let i = 0; i<elements.length; i++) {
//       elements[i].classList.remove('selected');
//     }
//     return resolve();
//   });
// }