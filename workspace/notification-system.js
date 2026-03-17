#!/usr/bin/env node

// Soma Notification System
// Handles creative notifications, SMS, and alerts

const VERBS = [
  "pontificates", "muses", "ruminates", "meditates", "contemplates", 
  "opines", "reflects", "considers", "ponders", "mulls",
  "chews on", "delves into", "explores", "examines", "scrutinizes",
  "dissects", "analyzes", "interprets", "decodes", "unravels",
  "illuminates", "clarifies", "elucidates", "articulates", "expresses",
  "suggests", "proposes", "recommends", "advises", "counsels",
  "whispers", "announces", "declares", "proclaims", "states",
  "observes", "notes", "mentions", "points out", "highlights",
  "wonders", "questions", "queries", "asks", "inquires"
];

const EMERGENCY_VERBS = [
  "screams", "shouts", "alarms", "warns", "alerts", "cries out", 
  "signals", "indicates", "notifies", "reports", "announces"
];

function getRandomVerb(emergency = false) {
  const verbs = emergency ? EMERGENCY_VERBS : VERBS;
  return verbs[Math.floor(Math.random() * verbs.length)];
}

function generateNotificationHeader(emergency = false) {
  const verb = getRandomVerb(emergency);
  const prefix = emergency ? "🚨 Soma" : "Soma";
  return `${prefix} ${verb}:`;
}

function formatNotification(message, emergency = false) {
  const header = generateNotificationHeader(emergency);
  return `${header}\n\n${message}`;
}

module.exports = {
  generateNotificationHeader,
  formatNotification,
  getRandomVerb
};