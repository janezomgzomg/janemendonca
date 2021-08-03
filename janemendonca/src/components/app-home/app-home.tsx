import { Component, h } from '@stencil/core';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.css',
  shadow: true,
})
export class AppHome {
  clickLink = (link) => {
    window.open(link);
  }

  experience = () => {
    const start = new Date("09 Jul 2012");
    const now = new Date();
    return now.getFullYear() - start.getFullYear();
  }

  render() {
    return (
      <div class="app-home">
        <div class="selfie"></div>
        <div class="text">
          <h2>About Me</h2>
          <p>
            Hello! My name is Jane Mendonca and I am a Front-End Engineer based in the San Francisco Bay Area.

            I have over {this.experience()} years of technical experience and I am currently a part of the Engineering team at <a href="https://lucidworks.com/" target="_blank">Lucidworks</a>.

            I also have many hobbies outside of web development that I like to pursue - not limited to open water swimming, physique training, cooking, playing the piano, and working on my Salsa skills.
          </p>
        </div>

        <div class="text">
          <h2>Work Experience</h2>
          <p>
          </p>
        </div>

        <div class="text">
          <h2>Skills</h2>
          <p>
          </p>
        </div>

        <div class="text">
          <h2>Languages</h2>
          <p>
          </p>
        </div>

        <div class="text">
          <h2>Find me on:</h2>
          <p>
            <ul class="links">
            <li class="linkedin" onClick={() => this.clickLink('https://www.linkedin.com/in/jane-mendonca-ab218a43/')}>
            </li>
          </ul>
          </p>
        </div>
      </div>
    );
  }
}
