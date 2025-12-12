// PRODUCTION CONTROL
const apiUrls = {
  development: "http://localhost:8080",
  production: "https://nexus-66h0.onrender.com",
};

export const getApiUrl = (env) => {
  return apiUrls[env] || apiUrls.development;
};
