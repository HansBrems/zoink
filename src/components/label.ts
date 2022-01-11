import Phaser from 'phaser';

const toLabelText = (title, value) => `${title}: ${value}`;

export default class Label {
  label: Phaser.GameObjects.Text;
  title: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    title: string,
    initialValue: any,
  ) {
    this.label = scene.add.text(x, y, toLabelText(title, initialValue), {
      font: '12px Arial',
    });
    this.title = title;
  }

  public update(value: any) {
    this.label.setText(toLabelText(this.title, value));
  }
}
