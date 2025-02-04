export const posterList = {default: 'poster.jpg', ocde: 'ocde.png'};
export function objectToUrlParams(player) {
    return Object.entries(player)
        .filter(([key, value]) => value !== null && value !== "")
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
}

export function minifyCSS(css) {
    return css
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s?([,:;{}])\s?/g, '$1') // Remove space around :,;,{}, and ,
      .trim(); // Trim the final string
}

export const buildQueryParams = (params) => {
    return Object.keys(params)
      .filter(key => params[key])
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
};

export const displayApiErrors = (error) => {
  console.log(error);

  let errorMessages = '';

  if (error.response) {
    const resp = error.response.data;

    if (resp.success === false) {
      if (Array.isArray(resp.data)) {
        // Iterate over errors if resp.data is an array
        errorMessages = resp.data.map(err => err).join('\n');
      } else if (typeof resp.data === 'object') {
        // Iterate over errors if resp.data is an object
        errorMessages = Object.values(resp.data).map(err => err).join('\n');
      } else {
        errorMessages = resp.data;
      }
    } else {
      console.log(resp);
    }
  } else {
    console.log('Error', error.message);
  }

  return errorMessages;
};
