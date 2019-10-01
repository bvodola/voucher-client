const truncate = (string, chars = 140) => {
  if(string.length > chars) {
    return string.substr(0,chars-3)+'...';
  } else {
    return string;
  }
  
}

export {
  truncate
}