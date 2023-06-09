import * as crypto from "node:crypto";

export class BytesReader {
  data: Buffer;
  offset: number;
  constructor (data: Buffer) {
    this.data = data;
    this.offset = 0;
  }
  readUIntBE (length: number) {
    if (this.offset + length > this.data.length) throw new Error('out of bounds')
    const value = this.data.readUIntBE(this.offset, length);
    this.offset += length;
    return value
  }
  readBytes (length: number, { allowShorter = false}: { allowShorter?: boolean } = {}) {
    if (!allowShorter && (this.offset + length > this.data.length)) throw new Error('out of bounds')
    const bytes = this.data.slice(this.offset, this.offset + length);
    this.offset += length;
    return bytes
  }
  readRemainder () {
    const bytes = this.data.slice(this.offset);
    this.offset = this.data.length;
    return bytes;
  }
  isExhausted () {
    return this.offset >= this.data.length
  }
  get length () {
    return this.data.length
  }
}

export const sha256 = (...data: Buffer[]): Buffer => {
	const hash = crypto.createHash('sha256')
  for (const d of data) {
    hash.update(d)
  }
  return hash.digest()
}