let session = {
  idToken: null,
  uid: null,
  user: null,
};

export function setSession(nextSession) {
  session = {
    ...session,
    ...nextSession,
  };
}

export function getSession() {
  return session;
}

export function clearSession() {
  session = {
    idToken: null,
    uid: null,
    user: null,
  };
}
