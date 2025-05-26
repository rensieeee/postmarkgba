import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';

const EV_SYN = 0x00;
const EV_KEY = 0x01;
const SYN_REPORT = 0x00;

const KEY_CODES = {
  KEY_Z: 44,        // A button
  KEY_X: 45,        // B button
  KEY_LEFT: 105,    // D-pad left
  KEY_RIGHT: 106,   // D-pad right
  KEY_UP: 103,      // D-pad up
  KEY_DOWN: 108,    // D-pad down
  KEY_ESC: 1,       // Start button
  KEY_TAB: 15,      // Select button
  KEY_Q: 16,        // L button
  KEY_O: 24,        // R button
  KEY_T: 20,        // Screenshot (with H)
  KEY_H: 35         // Screenshot hotkey
} as const;

@Injectable()
export class KeyboardService {
  private readonly keyMap = {
    'LEFT': KEY_CODES.KEY_LEFT,
    'RIGHT': KEY_CODES.KEY_RIGHT,
    'UP': KEY_CODES.KEY_UP,
    'DOWN': KEY_CODES.KEY_DOWN,
    'A': KEY_CODES.KEY_Z,
    'B': KEY_CODES.KEY_X,
    'START': KEY_CODES.KEY_ESC,
    'SELECT': KEY_CODES.KEY_TAB,
    'L': KEY_CODES.KEY_Q,
    'R': KEY_CODES.KEY_O,
    'T': KEY_CODES.KEY_T,
    'H': KEY_CODES.KEY_H
  } as const;

  private readonly inputDevice: string;
  private fd: number | null = null;

  constructor(private configService: ConfigService) {
    this.inputDevice = this.configService.getOrThrow('INPUT_DEVICE');
    this.fd = fs.openSync(this.inputDevice, 'w');
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private createInputEvent(type: number, code: number, value: number): Buffer {
    const buffer = Buffer.alloc(24);
    
    const time = process.hrtime();
    
    buffer.writeBigInt64LE(BigInt(time[0]), 0);
    buffer.writeBigInt64LE(BigInt(time[1] * 1000), 8);
    
    buffer.writeUInt16LE(type, 16);
    buffer.writeUInt16LE(code, 18);
    buffer.writeInt32LE(value, 20);

    return buffer;
  }

  private async writeInputEvent(type: number, code: number, value: number): Promise<void> {
    if (this.fd === null) {
      throw new Error('Input device is not open');
    }

    const event = this.createInputEvent(type, code, value);
    const bytesWritten = fs.writeSync(this.fd, event, 0, event.length);
    
    if (bytesWritten !== event.length) {
      throw new Error(`Failed to write complete event: wrote ${bytesWritten} of ${event.length} bytes`);
    }
  }

  async pressKey(key: string): Promise<void> {
    const upperKey = key.toUpperCase();

    const keyCode = this.keyMap[upperKey as keyof typeof this.keyMap];

    await this.writeInputEvent(EV_KEY, keyCode, 1);
    await this.writeInputEvent(EV_SYN, SYN_REPORT, 0);
    
    await this.delay(50);
    
    await this.writeInputEvent(EV_KEY, keyCode, 0);
    await this.writeInputEvent(EV_SYN, SYN_REPORT, 0);
  }

  async takeScreenshot(): Promise<void> {
    await this.writeInputEvent(EV_KEY, KEY_CODES.KEY_H, 1);
    await this.writeInputEvent(EV_SYN, SYN_REPORT, 0);
    
    await this.delay(50);
    
    await this.writeInputEvent(EV_KEY, KEY_CODES.KEY_T, 1);
    await this.writeInputEvent(EV_SYN, SYN_REPORT, 0);
    
    await this.delay(50);
    
    await this.writeInputEvent(EV_KEY, KEY_CODES.KEY_T, 0);
    await this.writeInputEvent(EV_SYN, SYN_REPORT, 0);
    
    await this.delay(50);
    
    await this.writeInputEvent(EV_KEY, KEY_CODES.KEY_H, 0);
    await this.writeInputEvent(EV_SYN, SYN_REPORT, 0);
  }
} 