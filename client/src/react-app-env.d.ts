interface IdConfiguration {
  client_id: string;
  auto_select?: boolean;
  callback: (handleCredentialResponse: CredentialResponse) => void;
  login_uri?: string;
  native_callback?: (...args: any[]) => void;
  cancel_on_tap_outside?: boolean;
  prompt_parent_id?: string;
  nonce?: string;
  context?: string;
  state_cookie_domain?: string;
  ux_mode?: 'popup' | 'redirect';
  allowed_parent_origin?: string | string[];
  intermediate_iframe_close_callback?: (...args: any[]) => void;
}

interface CredentialResponse {
  credential?: string;
  select_by?:
    | 'auto'
    | 'user'
    | 'user_1tap'
    | 'user_2tap'
    | 'btn'
    | 'btn_confirm'
    | 'brn_add_session'
    | 'btn_confirm_add_session';
  clientId?: string;
}

interface GsiButtonConfiguration {
  type: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signup_with';
  shape?: 'rectangular' | 'pill' | 'circle' | 'square';
  logo_alignment?: 'left' | 'center';
  width?: string;
  local?: string;
}

interface PromptMomentNotification {
  isDisplayMoment: () => boolean;
  isDisplayed: () => boolean;
  isNotDisplayed: () => boolean;
  getNotDisplayedReason: () =>
    | 'browser_not_supported'
    | 'invalid_client'
    | 'missing_client_id'
    | 'opt_out_or_no_session'
    | 'secure_http_required'
    | 'suppressed_by_user'
    | 'unregistered_origin'
    | 'unknown_reason';
  isSkippedMoment: () => boolean;
  getSkippedReason: () => 'auto_cancel' | 'user_cancel' | 'tap_outside' | 'issuing_failed';
  isDismissedMoment: () => boolean;
  getDismissedReason: () => 'credential_returned' | 'cancel_called' | 'flow_restarted';
  getMomentType: () => 'display' | 'skipped' | 'dismissed';
}

interface RevocationResponse {
  successful: boolean;
  error: string;
}

interface Credential {
  id: string;
  password: string;
}

interface Google {
  accounts: {
    id: {
      initialize: (input: IdConfiguration) => void;
      prompt: (momentListener?: (res: PromptMomentNotification) => void) => void;
      renderButton: (parent: HTMLElement, options: GsiButtonConfiguration) => void;
      disableAutoSelect: () => void;
      storeCredential: (credentials: Credential, callback: () => void) => void;
      cancel: () => void;
      onGoogleLibraryLoad: () => void;
      revoke: (hint: string, callback: (done: RevocationResponse) => void) => void;
    };
  };
}

interface Window {
  google?: Google;
}

interface FormState {
  email: string;
  password: string;
  error: {
    email: string;
    password: string;
  };
}

interface RegisterFormState {
  given_name: string;
  family_name: string;
  email: string;
  password: string;
  confirm_password: string;
  error: {
    given_name: string;
    family_name: string;
    email: string;
    password: string;
    confirm_password: string;
  };
}

interface RegisterSetFormState {
  (
    state: SetFormState<{
      given_name: string;
      family_name: string;
      email: string;
      password: string;
      confirm_password: string;
      error: {
        given_name: string;
        family_name: string;
        email: string;
        password: string;
        confirm_password: string;
      };
    }>,
  ): void;
}

interface SetFormState {
  (
    state: SetStateAction<{
      email: string;
      password: string;
      error: {
        email: string;
        password: string;
      };
    }>,
  ): void;
}

interface Friends {
  _id: string;
  fullName: string;
  given_name: string;
  family_name: string;
  email: string;
  profileUrl: string;
  isVerified: boolean;
}

interface User {
  _id: string;
  given_name: String;
  family_name: String;
  email: String;
  profileUrl: String;
  isAdmin: Boolean;
  isVerified: Boolean;
  postCount: Int;
  posts: [Post];
  friends: [User];
  blockedUsers: [User];
  friendRequests: [User];
  friendRequestCount: Int;
  createdAt: Date;
  updatedAt: Date;
  provider: String;
  fullName: String;
  friendCount: Int;
  createdAtFormatted: String;
  isLast?: Boolean;
  isRead?: Boolean;
}

interface Comments {
  _id: ID;
  commentText: String;
  commentAuthor: User;
  createdAt: Date;
  createdAtFormatted: String;
  likes: [User];
  likesCount: Int;
  replies: [Comment];
  isLastEl?: boolean;
}

interface Post {
  _id: ID;
  postImage: String;
  postText: String;
  postAuthor: User;
  createdAt: Date;
  comments: [Comment];
  commentCount: Int;
  likes: [User];
  likeCount: Int;
  createdAtFormatted: String;
  isLastEl?: boolean;
  isProfile?: boolean;
  csrfToken?: string;
}

interface SearchProps {
  handleSearch: (searchTerm: string) => void;
}

interface Notifications {
  _id: ID;
  is_read: boolean;
  message: string;
  postId: string;
  recipient: {
    _id: string;
    family_name: string;
    given_name: string;
    profileUrl: string;
  };
  sender: {
    _id: string;
    family_name: string;
    profileUrl: string;
    given_name: string;
  };
  type: string;
}

interface formInfo {
  name: string;
  type: string;
  placeholder: string;
}

interface RegisterInfo {
  success: boolean;
  message: string;
  subMessage: string;
}

interface Messages {
  _id?: string;
  sender?: User;
  status?: string;
  text?: string;
  createdAt?: Date;
}

interface ById {
  id?: string;
}
