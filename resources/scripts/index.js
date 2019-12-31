function openLink(link) {
  var LINKS = {
    github: {
      value: 'https://github.com/janezomgzomg'
    },
    linkedin: {
      value: 'https://www.linkedin.com/in/jane-mendonca-ab218a43/'
    }
  };
  var win = window.open(LINKS[link].value, '_blank');
}