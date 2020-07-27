const getTokenParam = (tokenParamName = 'token') => {
  const params = new URLSearchParams(window.location.search);
  return params.has(tokenParamName) ? params.get(tokenParamName) : undefined;
};

export default getTokenParam;
