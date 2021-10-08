const getCookie = (name) => {
  if (document == null) {
    return null;
  }
  const dc = document.cookie;
  const prefix = name + "=";
  let begin = dc.indexOf("; " + prefix);
  if (begin === -1) {
    begin = dc.indexOf(prefix);
    if (begin !== 0) return null;
  }
  else
  {
    begin += 2;
    let end = document.cookie.indexOf(";", begin);
    if (end === -1) {
      end = dc.length;
    }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

export default getCookie;
