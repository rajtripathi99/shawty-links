import { EventEmitter } from "events";

// In-process bus for click events. Fine for a single instance (the free tier);
// a multi-instance deployment would need Redis pub/sub instead.
export const linkEvents = new EventEmitter();

// One listener per open dashboard stream, so the default limit of 10 is too low.
linkEvents.setMaxListeners(0);
