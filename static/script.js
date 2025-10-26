async function updateKettle() {
    const cupsInput = document.getElementById('cups');
    let cups = parseInt(cupsInput.value) || 0;

    if (cups < 0) cups = 0;
    if (cups > 20) cups = 20; // Max value as per React component

    cupsInput.value = cups;

    const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cups: cups }),
    });

    const data = await response.json();

    document.getElementById('display-cups').innerText = data.cups;
    document.getElementById('display-water-volume').innerText = `${data.waterVolume} מ״ל`;
    document.getElementById('display-heating-time-summary').innerText = `${data.timeBreakdown.mins} דק׳ ${data.timeBreakdown.secs} שנ׳`;
    document.getElementById('display-hours').innerText = data.timeBreakdown.hours.toString().padStart(2, '0');
    document.getElementById('display-mins').innerText = data.timeBreakdown.mins.toString().padStart(2, '0');
    document.getElementById('display-secs').innerText = data.timeBreakdown.secs.toString().padStart(2, '0');

    document.getElementById('volume-per-cup').innerText = `${data.VOLUME_PER_CUP} מ״ל`;
    document.getElementById('max-kettle-volume-footer').innerText = `${data.MAX_KETTLE_VOLUME} מ״ל`;

    if (data.exceedsMaxVolume) {
        document.getElementById('max-kettle-volume-warning').innerText = data.MAX_KETTLE_VOLUME;
        document.getElementById('max-kettle-volume-info').innerText = data.MAX_KETTLE_VOLUME;
        document.getElementById('exceeds-warning').classList.remove('hidden');
    } else {
        document.getElementById('exceeds-warning').classList.add('hidden');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateKettle);
