import WebRenderer from "@elemaudio/web-renderer";

export class Engine {
  context;
  core;

  constructor() {
    this.core = new WebRenderer();
    this.context = new AudioContext();
    this.context.suspend();
  }

  async initialize() {
    // Start the audio context
    this.context.resume();
    console.log(this.context.state);

    // Initialize web renderer
    const node = await this.core.initialize(this.context, {
      numberOfInputs: 0,
      numberOfOutputs: 1,
      outputChannelCount: [1],
    });

    node.connect(this.context.destination);
  }

  render(node) {
    if (this.context.state === "running") {
      this.core.render(node);
    }
  }
}
