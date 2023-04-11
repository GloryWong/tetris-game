export type UserInteractionAction = () => void;

type UserInteractionKeyActions = Record<
  string,
  | {
      action: UserInteractionAction;
      longPressAction?: UserInteractionAction;
    }
  | UserInteractionAction
>;

export class UserInteraction {
  private keyActions;

  constructor(keyActions: UserInteractionKeyActions) {
    this.keyActions = keyActions;

    document.addEventListener('keydown', this.handler.bind(this));
  }

  destroy() {
    document.removeEventListener('keydown', this.handler.bind(this));
  }

  private handler(evt: KeyboardEvent) {
    const actions = this.keyActions[evt.key];
    if (!actions) return;

    let action;
    let longPressAction;
    if (actions instanceof Function) {
      action = actions;
    } else {
      action = actions.action;
      longPressAction = actions.longPressAction;
    }

    if (evt.repeat) {
      longPressAction?.();
    } else {
      action();
    }
  }
}
