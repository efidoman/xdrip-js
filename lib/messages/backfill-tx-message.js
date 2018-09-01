const crc = require('../crc');

const opcode = 0x50;

function BackfillTxMessage(timestampStart, timestampEnd) {
  this.data = Buffer.allocUnsafe(18).fill(opcode, 0, 1);
  this.data.writeUInt8(0x5, 1);
  this.data.writeUInt8(0x2, 2);
  this.data.writeUInt8(0x0, 3);
  this.data.writeUInt32LE(timestampStart, 4);
  this.data.writeUInt32LE(timestampEnd, 8);

  const crcBuffer = Buffer.allocUnsafe(2);
  crcBuffer.writeUInt16LE(crc.crc16(this.data));
  this.data = Buffer.concat([this.data, crcBuffer]);
}

BackfillTxMessage.opcode = opcode;

module.exports = BackfillTxMessage;

// NOTE: this is a total guess
// +--------+--------------------------+------------------------+--------+
// | [0]    | [1-4]                    | [5-8]                  | [9-10] |
// +--------+--------------------------+------------------------+--------+
// | opcode | dexcomStartTimeInSeconds | dexcomEndTimeInSeconds | CRC    |
// +--------+--------------------------+------------------------+--------+
// | 50     | 9e 32 66 00              | ce 5c 66 00            | 87 77  |
// +--------+--------------------------+------------------------+--------+
