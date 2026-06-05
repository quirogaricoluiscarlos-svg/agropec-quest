import { DialogueBox } from '../ui/DialogueBox.js';
import { InputManager } from '../systems/InputManager.js';

export class DialogueSystem {
  constructor() {
    this._box = new DialogueBox();
    this._nodes = [];
    this._idx = 0;
    this._onComplete = null;
    this.isActive = false;
    this._selectedOption = 0;
    this._waitingFeedback = false;
    this._feedbackTimer = 0;
    this._feedbackOk = false;
  }

  start(nodes, onComplete) {
    this._nodes = nodes;
    this._idx = 0;
    this._onComplete = onComplete;
    this.isActive = true;
    InputManager.dialogueActive = true;
    this._showCurrent();
  }

  _showCurrent() {
    const node = this._nodes[this._idx];
    this._selectedOption = 0;
    this._waitingFeedback = false;
    this._box.setNode(node, 0);
  }

  _advance() {
    this._idx++;
    if (this._idx >= this._nodes.length) {
      this.isActive = false;
      InputManager.dialogueActive = false;
      this._box.setNode(null);
      this._onComplete?.();
    } else {
      this._showCurrent();
    }
  }

  update(dt) {
    if (!this.isActive) return;
    const node = this._nodes[this._idx];

    if (this._waitingFeedback) {
      this._feedbackTimer -= dt;
      if (this._feedbackTimer <= 0) {
        if (this._feedbackOk) this._advance();
        else { this._waitingFeedback = false; this._box.setFeedback(null, false); }
      }
      return;
    }

    if (node.type === 'dialogue') {
      if (InputManager.consumeKey('Space') || InputManager.consumeKey('Enter') || InputManager.consumeClick()) {
        this._advance();
      }
    } else if (node.type === 'quiz') {
      if (InputManager.consumeKey('ArrowUp') || InputManager.consumeKey('KeyW')) {
        this._selectedOption = Math.max(0, this._selectedOption - 1);
        this._box.selectOption(this._selectedOption);
      }
      if (InputManager.consumeKey('ArrowDown') || InputManager.consumeKey('KeyS')) {
        this._selectedOption = Math.min(node.options.length - 1, this._selectedOption + 1);
        this._box.selectOption(this._selectedOption);
      }
      for (let i = 0; i < node.options.length; i++) {
        if (InputManager.consumeKey(`Digit${i + 1}`)) {
          this._selectedOption = i;
          this._box.selectOption(i);
        }
      }
      if (InputManager.consumeKey('Space') || InputManager.consumeKey('Enter')) {
        const correct = this._selectedOption === node.correct;
        this._feedbackOk = correct;
        this._box.setFeedback(correct ? node.feedback_ok : node.feedback_err, correct);
        this._waitingFeedback = true;
        this._feedbackTimer = correct ? 1.5 : 2.0;
      }
    }
  }

  draw(ctx) {
    if (!this.isActive) return;
    this._box.draw(ctx);
  }
}
