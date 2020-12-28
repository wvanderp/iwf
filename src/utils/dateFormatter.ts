function addZero(number: number): string {
    return number.toString().length === 1 ? `0${number}` : `${number}`;
}

export default function dateFormatter(date: Date): string {
    // eslint-disable-next-line max-len
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getUTCDate())}T${addZero(date.getUTCHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}Z`;
}
