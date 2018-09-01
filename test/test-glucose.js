const chai = require('chai');
chai.use(require('chai-datetime'));
const should = chai.should;

const Glucose = require('../lib/glucose');
const TransmitterTimeRxMessage = require('../lib/messages/transmitter-time-rx-message');
const GlucoseRxMessage = require('../lib/messages/glucose-rx-message');
const CalibrationState = require('../lib/calibration-state');
const TransmitterStatus = require('../lib/transmitter-status');

describe('Glucose', function() {
  let timeMessage;
  let syncDate;

  before(function() {
    const data = Buffer.from('2500470272007cff710001000000fa1d', 'hex');
    timeMessage = new TransmitterTimeRxMessage(data);
    syncDate = Date.UTC(2016, 6, 17); // 17 July 2016 (months are 0 - 11)
    activationDate = new Date(syncDate - timeMessage.currentTime * 1000);

//    console.log(activationDate);
  });

  it('should parse message data', function() {
    const data = Buffer.from('3100680a00008a715700cc0006ffc42a', 'hex');
    const message = new GlucoseRxMessage(data);
    const glucose = new Glucose(message, timeMessage, activationDate);
    glucose.status.should.equal(TransmitterStatus.ok);
    glucose.state.should.equal(CalibrationState.ok);
    // there are 1740989 seconds between the glucose timestamp and the current time in the above hex strings
    glucose.readDate.should.equalDate(new Date(syncDate - 1740989 * 1000));
    glucose.isDisplayOnly.should.be.false;
    glucose.glucose.should.equal(204);
    glucose.trend.should.equal(-1);
  });
});
