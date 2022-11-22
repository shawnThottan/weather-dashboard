import { useEffect, useState } from 'react';

const APP_ID = process.env.REACT_APP_OPEN_WEATHER_API_KEY;

const useFetchWeather = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Resets error after time
    useEffect(() => {
        if (error) {
            setTimeout(() => setError(''), 1000);
        }
    }, [error]);

    const updateWeather = (city) => {
        if (!city) {
            setError('Please provide a valid city.');
            return;
        }

        setLoading(true);
        return fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&APPID=${APP_ID}`)
            .then(data => {
                if (data.ok) {
                    return data.json();
                }

                throw new Error(data.statusText);
            })
            .catch(err => {
                setError('Error Fetching. Try Again!');
                console.error('ERROR fetching Weather: ' + err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return [updateWeather, loading, error];
}

export { useFetchWeather }