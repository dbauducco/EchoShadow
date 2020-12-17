import { EventEmitter } from 'events';
import { EventType } from '../types/EventType';

class Event extends EventEmitter {}

export default new Event();
