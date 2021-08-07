import { EventEmitter } from 'events';

class Event extends EventEmitter {}

const Events = new Event();

export { Events };
