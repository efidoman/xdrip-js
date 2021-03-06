const crc = require('../crc');

const opcode = 0x31;

function GlucoseRxMessage(data) {
  if ((data.length !== 16) || (data[0] !== opcode) || !crc.crcValid(data)) {
    throw new Error('cannot create new GlucoseRxMessage');
  }
  this.status = data.readUInt8(1);
  this.sequence = data.readUInt32LE(2);
  this.timestamp = data.readUInt32LE(6);

  const glucoseBytes = data.readUInt16LE(10);
  this.glucoseIsDisplayOnly = (glucoseBytes & 0xf000) > 0;
  this.glucose = glucoseBytes & 0xfff;
  this.state = data.readUInt8(12);
  this.trend = data.readInt8(13);
}

GlucoseRxMessage.opcode = opcode;

module.exports = GlucoseRxMessage;
