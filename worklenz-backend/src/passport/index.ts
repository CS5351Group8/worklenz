import passport from "passport";

import {deserialize} from "./deserialize";
import {serialize} from "./serialize";

import LocalLogin from "./passport-strategies/passport-local-login";
import LocalSignup from "./passport-strategies/passport-local-signup";

// Import Google strategies at the top with dynamic import
let GoogleLogin: any;
let GoogleMobileLogin: any;

/**
 * Use any passport middleware before the serialize and deserialize
 * @param {Passport} passport
 */
export default (passport: any) => {
  passport.use("local-login", LocalLogin);
  passport.use("local-signup", LocalSignup);
  
  // Only register Google strategies if client ID is provided
  if (process && process.env && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_ID.trim()) {
    try {
      // Import modules dynamically
      GoogleLogin = require("./passport-strategies/passport-google").default;
      GoogleMobileLogin = require("./passport-strategies/passport-google-mobile").default;
      passport.use(GoogleLogin);
      passport.use("google-mobile", GoogleMobileLogin);
    } catch (error) {
      console.error("Failed to load Google authentication strategies:", error);
    }
  }
  
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
};
