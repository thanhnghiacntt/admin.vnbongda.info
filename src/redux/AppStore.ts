
import { createStore, Action } from "redux"
import LocalizedStrings from 'react-localization'
import * as ResourceLanguage from "../Language"
import { UserService } from '../services/UserService';
import { Cookie } from '../helpers/Cookie';

export enum Language {
  en = "en", vi = "vi", cn = "cn"
}

export enum AppEvent {
  initialize = "initialize",
  redirect = "redirect",
  login = "login",
  logout = "logout",
  changeLanguague = "changeLanguague",
  changePageTitle = "changePageTitle",
  changePageSize = "changePageSize",
  setToken = "setToken"
}

export interface AppState {
  event: AppEvent,
  isLoggedIn?: boolean,
  currentLanguage?: Language,
  strings?: any
  targetRoute?: string
  pageTitle?: string
  pageSize?: number
  token?: string
}

let defaultState: AppState = {
  event: AppEvent.initialize,
  currentLanguage: Cookie.get("language") || Language.en,
  strings: new LocalizedStrings(ResourceLanguage.default),
  pageTitle: "",
  pageSize: 40,
  token: Cookie.get("")
};

export class AppStore {

  static appReducer(state: AppState = defaultState, action: AppAction<AppEvent, any>) {

    state.event = action.type;

    switch (action.type) {
      case AppEvent.initialize:
        state.currentLanguage = action.payload as Language;
        state.strings.setLanguage(state.currentLanguage);
        break;
      case AppEvent.changeLanguague:
        state.currentLanguage = action.payload as Language;
        state.strings.setLanguage(state.currentLanguage);
        UserService.shared.saveLanguage(state.currentLanguage);
        break;
      case AppEvent.login:
        state.isLoggedIn = action.payload as boolean;
        break;
      case AppEvent.logout:
        state.isLoggedIn = !action.payload as boolean;
        break;
      case AppEvent.redirect:
        state.targetRoute = action.payload as string;
        break;
      case AppEvent.changePageTitle:
        state.pageTitle = action.payload as string;
        break;
      case AppEvent.changePageSize:
        state.pageSize = action.payload as number;
        break;
      case AppEvent.setToken:
        state.token = action.payload as string;
        break
      //Other case

    }

    return state
  }

  public static postEvent(event: AppEvent, data: any) {
    this.getStore().dispatch({ type: event, payload: data });
  }

  public static subscribe(listener: (state: AppState) => void) {
    return this.getStore().subscribe(() => {
      listener(this.getStore().getState())
    })
  }

  public static getStore() {
    return this.store
  }

  public static getState() {
    return this.getStore().getState() as AppState
  }

  static store = createStore(AppStore.appReducer)
}

export interface AppAction<T, Data> extends Action {
  type: T,
  payload?: Data
}
