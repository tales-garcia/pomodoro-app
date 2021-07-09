export default function formatTime(time: number) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor(time % 3600 / 60);
    const seconds = Math.floor(time % 3600 % 60);

    const stringHours = String(hours).padStart(2, '0');
    const stringMinutes = String(minutes).padStart(2, '0');
    const stringSeconds = String(seconds).padStart(2, '0');

    return `${!!hours ? `${stringHours}:` : ''}${stringMinutes}:${stringSeconds}`;
}