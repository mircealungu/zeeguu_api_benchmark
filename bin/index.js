#!/usr/bin/env node

import "./ZeeguuAPI.js";

console.log("Hello!");

const api = ZeeguuAPI("192.168.0.1:8080");
api.attemptToSignIn();
