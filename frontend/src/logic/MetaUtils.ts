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
    // Overflow Hours Fix
    append(Math.floor(duration.asHours()));
    append(duration.minutes());
    append(duration.seconds());

    return values.join(":");
}