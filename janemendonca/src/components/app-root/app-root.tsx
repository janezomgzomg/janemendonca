import { Component, h } from '@stencil/core';
import { resume } from '../app-home/resume';

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.css',
  shadow: true,
})
export class AppRoot {
  render() {
    return (
      <div>
        <header>
          <div class="name">
            <h1>Jane Mendonca</h1>
            <h4>/d͡ʒeɪn men,dɒnsɑː/</h4>
          </div>
          <div class="sections-menu">
            <ul>
              {resume.sections.map((section) => {
                return (<li>{section.title}</li>)
              })}
              
            </ul>
          </div>
        </header>

        <main>
          <stencil-router>
            <stencil-route-switch scrollTopOffset={0}>
              <stencil-route url="/" component="app-home" exact={true} />
            </stencil-route-switch>
          </stencil-router>
        </main>
      </div>
    );
  }
}
