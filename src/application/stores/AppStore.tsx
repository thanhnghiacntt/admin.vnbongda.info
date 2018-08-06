import {createStore, Action} from "redux";
import {DialogData} from "../../common/components/dialog/Dialog";


/**
 * list of actions
 */

export enum AppEvent {
  None = "None",
  Toggle = "toggle",
  ChangeTitle = "changeTitle",
  Redirect = "Redirect",
  ShowDialog = "ShowDialog",
  HideDialog = "HideDialog",
  ShowSpinner = "ShowSpinner"
};

/**
 * the application state
 */
export interface AppState {
  event: AppEvent,
  collapsed?: boolean,
  title?: string,
  redirectTo?: string,
  dialogData?: DialogData,
  spin?: boolean
}

export interface AppAction extends Action {
  payload: any
}

var defaultState: AppState = {
  event: AppEvent.None,
  collapsed: false,
  title: ""
}


/**
 * the reducer for app store
 * @param state initial state
 * @param action the action
 * @returns {AppState}
 */
function sidebarReducer(state: AppState = defaultState,
                        action: Action) {

  state.event = action.type;
  state.redirectTo = null

  switch (action.type) {
    /// on sidebar toggled
    case AppEvent.Toggle:
      state.collapsed = !state.collapsed
      break;
    case AppEvent.ChangeTitle :
      state.title = (action as AppAction).payload;
      break;
    case AppEvent.Redirect:
      state.redirectTo = (action as AppAction).payload;
      break;
    case AppEvent.ShowDialog:
      state.dialogData = (action as AppAction).payload;
      break;
    case AppEvent.HideDialog:
      if (state.dialogData != null) {
        state.dialogData.answer = (action as AppAction).payload.answer;
      }
      else {
        state.dialogData = (action as AppAction).payload;
      }
      break;
    case AppEvent.ShowSpinner:
      state.spin = (action as AppAction).payload
      break;
    default:
      break;
  }

  return state;
}

export function postEvent(event: AppEvent, value: any) {
  appStore.dispatch({type: event, payload: value});
}

export function subscribe(listen: (state) => void) {
  return appStore.subscribe(() => listen(appStore.getState()))
}

/**
 * the store for sidebar
 * @type {Store<AppState>}
 */
const appStore = createStore(sidebarReducer);
export default appStore;