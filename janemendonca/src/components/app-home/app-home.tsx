import { Component, h, State } from '@stencil/core';
import { resume } from './resume';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  clickLink = (link) => {
    window.open(link);
  }

  render() {
    return (
      <div class="app-home">
        <div class="about-me section">
          <div class="selfie"></div>
          <app-profile section={resume.aboutMe} />
        </div>

        {resume.sections.map((section) => {
          return (<div class="section"><app-profile section={section} /></div>)
        })}
      </div>
    );
  }
}
