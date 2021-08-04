import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'app-profile',
  styleUrl: 'app-profile.css',
  shadow: true,
})
export class AppProfile {
  @Prop() section: any;

  // componentWillLoad() {
  //   console.log(this.section);
  // }

  render() {
    return (
      <div class="app-profile">
        <h2>{this.section.title}</h2>
        <p>{this.section.text}</p>
      </div>
    );
  }
}
