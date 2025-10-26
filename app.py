from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

VOLUME_PER_CUP = 200  # ml
MAX_KETTLE_VOLUME = 1700  # ml
HEATING_TIME_PER_LITER = 3.5  # minutes

def calculate_kettle_data(cups):
    # Calculate water volume
    calculated_volume = cups * VOLUME_PER_CUP
    
    # Check if it exceeds max kettle volume
    exceeds_max_volume = False
    if calculated_volume > MAX_KETTLE_VOLUME:
        calculated_volume = MAX_KETTLE_VOLUME
        exceeds_max_volume = True
        
    # Calculate heating time
    time_in_minutes = (calculated_volume / 1000) * HEATING_TIME_PER_LITER
    
    return calculated_volume, time_in_minutes, exceeds_max_volume

def format_time_detailed(minutes):
    hours = int(minutes / 60)
    mins = int(minutes % 60)
    secs = round((minutes - int(minutes)) * 60)
    
    return {'hours': hours, 'mins': mins, 'secs': secs}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    cups = int(request.json.get('cups', 1))
    
    water_volume, heating_time, exceeds_max_volume = calculate_kettle_data(cups)
    time_breakdown = format_time_detailed(heating_time)
    
    return jsonify({
        'cups': cups,
        'waterVolume': water_volume,
        'heatingTime': heating_time,
        'timeBreakdown': time_breakdown,
        'exceedsMaxVolume': exceeds_max_volume,
        'MAX_KETTLE_VOLUME': MAX_KETTLE_VOLUME,
        'VOLUME_PER_CUP': VOLUME_PER_CUP
    })

if __name__ == '__main__':
    app.run(debug=True)
