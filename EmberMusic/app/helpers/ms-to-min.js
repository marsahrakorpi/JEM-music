import { helper } from '@ember/component/helper';

export function msToMin(params/*, hash*/) {
  let minutes = Math.floor(params / 60000);
  let seconds = ((params % 60000) / 1000).toFixed(0);

  return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);

}

export default helper(msToMin);
