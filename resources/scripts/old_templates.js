
function renderResume() {
  console.log('rendering resume');
  let resumeContainer = document.getElementById('section-resume');
  resumeSchema.forEach((section) => {
    // console.log(section);
    let sectionTemplate = renderElement(section);
    // console.log(template);
    // let template = renderElement(section.type, section.content, section)
    // let sectionContainer = document.createElement('div');
    // sectionContainer.classList.add('section-part');
    // if(section.label) {
    //   sectionContainer.appendChild(renderElement('h2', section.label));
    // }
    // if(section.segment) {
    //   section.segment.forEach((segment) => {
    //     // sectionContainer.appendChild(renderSectionSegment(segment));
    //   })
    // }
    resumeContainer.appendChild(sectionTemplate);
  });
}