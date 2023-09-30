export default function authHeader() {
  let user = JSON.parse(localStorage.getItem('userC'));

  if (user && user.accessToken) {
    return { Authorization: '' + user.accessToken };
  } else {
    return {};
  }
}
export function authHeaderE() {
  let user = JSON.parse(localStorage.getItem('userE'));

  if (user && user.accessToken) {
    return { Authorization: '' + user.accessToken };
  } else {
    return {};
  }
}