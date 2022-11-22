import { useEffect, useState, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { useTimeout } from '../../customHooks';
import { Form } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsToDot, faDroplet, faMoon, faPlus, faSpinner, faSun, faTemperatureThreeQuarters, faTrashCan, faTriangleExclamation, faWind } from '@fortawesome/free-solid-svg-icons';
import './WeatherCard.css';
import { useFetchWeather } from '../../api';
import { cities } from '../../constants';

const WeatherCard = ({ id }) => {
    const cardId = `card-${id}`;
    const [weather, setWeather] = useState({});
    const [timeout, clear] = useTimeout();
    const [updateWeather, loading, error] = useFetchWeather();
    const cityRef = useRef(null);

    // Initializes card
    useEffect(() => {
        const data = localStorage.getItem(cardId);
        if (!data) {
            return;
        }

        try {
            const weather = JSON.parse(data);
            setWeather(weather);
            fetchWeather(weather.name);
        } catch (e) {
            console.error('Error Parsing JSON: ' + e);
        }
    }, []);

    // Fetches the weather
    const fetchWeather = async (name) => {
        clear();
        const weather = await updateWeather(name);
        timeout.current = setTimeout(() => fetchWeather(name), 30000);

        if (weather) {
            localStorage.setItem(cardId, JSON.stringify(weather));
            setWeather(weather);
        }
    };

    // Sets the city from input to card
    const keyDownListener = (e) => {
        if (e.code === "Enter" || e.code === "NumpadEnter") {
            addCity();
            e.preventDefault();
        }
    }

    const addCity = () => {
        fetchWeather(cityRef?.current?.value);
    }

    // Resets the card
    const removeCity = () => {
        clear();
        localStorage.removeItem(cardId);
        setWeather({});
    }

    // UI Components
    const displayIf = (condition) => {
        return !!condition ? '' : 'd-none';
    }

    const getTime = (time) => {
        const date = new Date(time * 1000);
        const padByZero = (s) => String(s).padStart(2, '0');
        return `${padByZero(date.getHours())} : ${padByZero(date.getMinutes())}`;
    }

    const emptyCardBody = () => (
        <Card.Body>
            <div className='p-2' style={{ textAlign: 'center' }}>
                <FontAwesomeIcon icon={faTriangleExclamation} className={`fa-6x my-4 ${displayIf(error)}`} />
                <FontAwesomeIcon icon={faSpinner} className={`fa-6x fa-spin my-4 ${displayIf(loading)}`} />
                <FontAwesomeIcon icon={faPlus} className={`fa-6x my-4 ${displayIf(!error && !loading)}`} role='button' onClick={addCity} />
                <Form.Control ref={cityRef} className='my-3 neumorphic border-0' type="text" onKeyDown={keyDownListener} placeholder={cities[id % cities.length]} />
                <p>{error}</p>
            </div>
        </Card.Body>
    );

    const weatherCardBody = () => (
        <Card.Body>
            <div>
                <h4 className='title mx-2'>{weather?.name}</h4>
                <p className='country mx-2 position-absolute'>{weather?.sys?.country}</p>
            </div>
            <div className='top-right'>
                <FontAwesomeIcon icon={faSpinner} className={`my-4 fa-spin ${displayIf(loading)}`} />
                <FontAwesomeIcon icon={faTriangleExclamation} className={`my-4 ${displayIf(error)}`} />
                <FontAwesomeIcon icon={faTrashCan} className='fa m-4' style={{ width: '1rem' }} role='button' onClick={removeCity} />
            </div>
            <div style={{ textAlign: 'center' }}>
                <Card.Img src={`http://openweathermap.org/img/wn/${weather?.weather?.[0]?.icon}@4x.png`} style={{ width: '6rem' }} />
                <h4>{weather?.weather?.[0]?.main}</h4>
                <p>{weather?.weather?.[0]?.description}</p>

            </div>
            <div className='my-4 mx-3 bottom-left'>
                <div>
                    <FontAwesomeIcon icon={faTemperatureThreeQuarters} className='fa mx-2 weather-prop' style={{ width: '1rem' }} />{weather?.main?.temp} °C
                </div>
                <div>
                    <FontAwesomeIcon icon={faDroplet} className='fa mx-2' style={{ width: '1rem' }} />{weather?.main?.humidity} %
                </div>
                <div>
                    <FontAwesomeIcon icon={faWind} className='fa mx-2' style={{ width: '1rem' }} />{weather?.wind?.speed} mps
                </div>
            </div>
            <div className='m-4 bottom-right'>
                <div>
                    <FontAwesomeIcon icon={faArrowsToDot} className='fa mx-2 weather-prop' style={{ width: '1rem' }} />{weather?.main?.pressure} Pa
                </div>
                <div>
                    <FontAwesomeIcon icon={faSun} className='fa mx-2' style={{ width: '1rem' }} />{getTime(weather?.sys?.sunrise)}
                </div>
                <div>
                    <FontAwesomeIcon icon={faMoon} className='fa fa-regular mx-2' style={{ width: '1rem' }} />{getTime(weather?.sys?.sunset)}
                </div>
            </div>
        </Card.Body>
    );

    return <Card id='weather-card' className='neumorphic'>
        {weather?.name ? weatherCardBody() : emptyCardBody()}
    </Card>;
}

export default WeatherCard;