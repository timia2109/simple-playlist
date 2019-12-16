import moment from "moment";

export function humanizeMs(ms: number): string {
    const duration = moment.duration(ms);
    let values : string[] = [];

    const append = (nV: number) => {
        let val = nV.toString();
        values.push(val.length < 2 ? "0" + val : val);
    };

    // Only support H:m:s now
    // I think more is not required
    append(duration.hours());
    append(duration.minutes());
    append(duration.seconds());

    return values.join(":");
}