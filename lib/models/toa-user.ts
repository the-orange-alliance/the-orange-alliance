import { ISerializable } from '@the-orange-alliance/api/lib/cjs/models/ISerializable';
import type { User } from 'firebase/auth';

export default class TOAUser implements ISerializable {
  uid: string;
  email: string;
  emailVerified: boolean;
  phoneNumber: string;
  displayName: string;
  photoURL: string;
  disabled: boolean;
  metadata: any;
  level: number;
  team: string;
  apiKey: string;
  favoriteTeams: string[];
  notifyTeams: string[];
  favoriteEvents: string[];
  notifyEvents: string[];
  adminEvents: string[];
  adminLeagues: string[];
  individualAdminEvents: string[];
  eventsApiKeys: any;
  adminRegions: string[];
  adminTeams: string[];
  emailLinked: boolean;
  googleLinked: boolean;
  githubLinked: boolean;
  phoneLinked: boolean;
  isDev: boolean;

  firebaseUser: User | null = null;

  constructor() {
    this.uid = '';
    this.email = '';
    this.emailVerified = false;
    this.phoneNumber = '';
    this.displayName = '';
    this.photoURL = '';
    this.disabled = false;
    this.metadata = [];
    this.level = -1;
    this.team = '';
    this.apiKey = '';
    this.favoriteTeams = [];
    this.notifyTeams = [];
    this.favoriteEvents = [];
    this.notifyEvents = [];
    this.adminEvents = [];
    this.individualAdminEvents = [];
    this.eventsApiKeys = '';
    this.adminRegions = [];
    this.adminTeams = [];
    this.adminLeagues = [];
    this.emailLinked = false;
    this.googleLinked = false;
    this.githubLinked = false;
    this.phoneLinked = false;
    this.isDev = false;
    this.firebaseUser = null;
  }

  toJSON(): object {
    return {
      uid: this.uid,
      email: this.email,
      emailVerified: this.emailVerified,
      phoneNumber: this.phoneNumber,
      displayName: this.displayName,
      photoURL: this.photoURL,
      disabled: this.disabled,
      metadata: this.metadata,
      level: this.level,
      team: this.team,
      api_key: this.apiKey,
      favorite_teams: this.favoriteTeams,
      notify_teams: this.notifyTeams,
      favorite_events: this.favoriteEvents,
      notify_events: this.notifyEvents,
      admin_events: this.adminEvents,
      individual_admin_events: this.individualAdminEvents,
      events_api_keys: this.eventsApiKeys,
      admin_regions: this.adminRegions,
      admin_teams: this.adminTeams,
      admin_leagues: this.adminLeagues,
      email_linked: this.emailLinked,
      google_linked: this.googleLinked,
      github_linked: this.githubLinked,
      phone_linked: this.phoneLinked,
      is_dev: this.isDev
    };
  }

  fromJSON(json: any): TOAUser {
    const user: TOAUser = new TOAUser();
    user.uid = json.uid;
    user.email = json.email;
    user.emailVerified = json.emailVerified;
    user.phoneNumber = json.phoneNumber;
    user.displayName = json.displayName;
    user.photoURL = json.photoURL;
    user.disabled = json.disabled;
    user.metadata = json.metadata;
    user.level = json.level || 1;
    user.team = json.team;
    user.apiKey = json.api_key;
    user.favoriteTeams = json.favorite_teams || [];
    user.notifyTeams = json.notify_teams || [];
    user.favoriteEvents = json.favorite_events || [];
    user.notifyEvents = json.notify_events || [];
    user.adminEvents = json.admin_events || [];
    user.individualAdminEvents = json.individual_admin_events || [];
    user.eventsApiKeys = json.events_api_keys;
    user.adminRegions = json.admin_regions || [];
    user.adminTeams = json.admin_teams || [];
    user.adminLeagues = json.admin_leagues || [];
    user.emailLinked = json.email_linked;
    user.googleLinked = json.google_linked;
    user.githubLinked = json.github_linked;
    user.phoneLinked = json.phone_linked;
    user.isDev = json.is_dev;
    return user;
  }
}
