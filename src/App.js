import React, { useState, useEffect } from 'react';
import { API_KEY, BASE_URL } from './config';
import MapComponent from './components/MapComponent';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';


function App() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState(''); // Estado para la ciudad a buscar

  // Función para obtener la ubicación del usuario
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude);
      }, error => {
        console.error('Error obteniendo la ubicación:', error);
        setCity('Buenos Aires'); // Ciudad predeterminada si no se puede obtener la ubicación
      });
    } else {
      console.error('Geolocalización no soportada');
      setCity('Buenos Aires'); // Ciudad predeterminada si geolocalización no está disponible
    }
  };

  // Función para obtener el clima por coordenadas
  const fetchWeatherByCoords = (lat, lon) => {
    fetch(`${BASE_URL}weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&lang=sp&units=metric`)
      .then(response => response.json())
      .then(data => setWeather(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  // Función para obtener el clima por nombre de ciudad
  const fetchWeatherByCity = (city) => {
    fetch(`${BASE_URL}weather?q=${city}&appid=${API_KEY}&lang=sp&units=metric`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Error fetching data for ${city}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => setWeather(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  useEffect(() => {
    if (city) {
      fetchWeatherByCity(city);
    }
  }, [city]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchCity.trim()) {
      setCity(searchCity.trim()); // Actualizar la ciudad cuando se realiza la búsqueda
    } else {
      alert("Por favor, ingrese una ciudad válida.");
    }
  };

  const handleCopyCoordinates = () => {
    if (weather?.coord) {
      const coordinates = `Lat: ${weather.coord.lat}, Lon: ${weather.coord.lon}`;
      navigator.clipboard.writeText(coordinates)
        .then(() => alert('Coordenadas copiadas al portapapeles'))
        .catch(() => alert('Error al copiar las coordenadas'));
    }
  }


  const getLocalTime = (timezone) => {
    const now = new Date();
    const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
    const localTime = new Date(utcTime + timezone * 1000);
    return localTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const cloth = weather?.weather?.[0]?.main.toLowerCase();
  const clothReco = '/cloths/anything.png' ? `/cloths/${cloth}.png` : '';
  const icon = weather?.weather?.[0]?.icon;
  const iconUrl = icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : '';
  const lat = weather?.coord?.lat || 0;
  const lon = weather?.coord?.lon || 0;
  const cityName = weather?.name || '';

  const getDayOrNight = (icon) => icon && icon.slice(-1);
  const time = weather && getDayOrNight(weather.weather[0].icon);
  console.log(time)
  const dayImg = time ? `/city${time}.png` : '/city.png';

  return (
    <div className="mx-auto flex flex-col w-full justify-center items-center lg:max-w-[1600px] my-2  ">

      {/* Formulario de búsqueda */}
      <form onSubmit={handleSearch} className="p-5 overflow-hidden w-[60px] h-[60px] hover:w-[270px] bg-[#212126] shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300 mb-3 ">
        <div className="flex items-center justify-center fill-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Isolation_Mode"
            data-name="Isolation Mode"
            viewBox="0 0 24 24"
            width="22"
            height="22"
          >
            <path
              d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z"
            ></path>
          </svg>
        </div>
        <input 
          type="text" 
          value={searchCity} 
          onChange={(e) => setSearchCity(e.target.value)} 
          placeholder="Buscar ciudad..." 
          className="outline-none text-[20px] bg-transparent w-full text-white font-normal px-4"
        />
      </form>

      {weather && (
      <div className='grid grid-cols-10 grid-rows-10 w-full lg:max-h-screen gap-x-5 gap-y-5 bg-[#C0C1C5] p-5 rounded-3xl'>
        <section className='flex flex-col col-span-10 lg:col-span-4 lg:row-span-2 justify-center bg-[#FFFFFF] rounded-3xl'>
          <h1 className='text-center font-bold text-3xl lg:text-6xl '>Clima<span className='text-red-800'>HOY</span></h1>
          <h4 className='text-center text-xl uppercase'>Monitorea tu país a tu gusto</h4>
        </section>

        <section className='lg:row-span-3 col-span-5 lg:col-span-2 h-full justify-start items-center bg-[#F8F8F9]/60 rounded-2xl bg-gradient-to-tl from-transparent to-[#F8F8F9] '>


          {/* Slider de atributos */}
          <Swiper
            modules={[Autoplay]}
            spaceBetween={100}
            slidesPerView={1}
            pagination={{clickable: true}}
            autoplay={{ delay: 2000 }}
            loop={true}
            className="w-full mt-4 select-none uppercase hover:cursor-grab active:cursor-grabbing"
          >
            <SwiperSlide>
            <div className='flex flex-col text-center'>
              <h1 className='text-center text-wrap tracking-wide text-3xl uppercase mt-2'>
              {weather.weather[0].description}
              </h1>
              {icon && <img className='mx-auto size-40 drop-shadow-xl' src={iconUrl} alt="Weather Icon" />}
            </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='text-center'>
                <h2 className='text-xl '>Humedad</h2>
                <img 
                  className='size-32 mx-auto my-2'
                  src='/icons/humidity.svg'
                  alt='Humedad'
                />
                <p className='text-lg'>{weather.main.humidity}%</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='text-center'>
                <h2 className='text-xl'>Presión</h2>
                <img 
                  className='size-32 mx-auto my-2'
                  src='/icons/pressure.svg'
                  alt='Presión'
                />
                <p className='text-lg'>{weather.main.pressure} hPa</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='text-center'>
                <h2 className='text-xl'>Viento</h2>
                <img 
                  className='size-32 mx-auto my-2'
                  src='/icons/wind.svg'
                  alt='Viento'
                />
                <p className='text-lg'>{weather.wind.speed} m/s</p>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className='text-center'>
                <h2 className='text-xl'>Precipitación</h2>
                <img 
                  className='size-32 mx-auto my-2'
                  src='/icons/precipitation.svg'
                  alt='Precipitación'
                />
                <p className='text-lg'>{weather.rain ? weather.rain['1h'] : '0'} mm</p>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>


        <section className='flex relative row-span-1 col-span-5  lg:row-span-5 lg:col-span-4 h-full justify-start overflow-hidden bg-[#212126] p-3 rounded-2xl'>
          <button className='flex size-20 z-50'>
            <a href='/'>
              <img src='/ps.svg' alt='' />
            </a>
          </button>
          <article className='flex flex-col ml-auto '>
            <h1 className='text-center lg:text-right tracking-wide font-semibold text-xl lg:pr-10 text-white uppercase'>
              ClimaHOY APP
            </h1>
            <p className='lg:text-right lg:max-w-64 lg:pr-9 lg:ml-auto text-xs lg:text-lg text-white '>
              Consigue <b>YA</b> nuestra nueva aplicación de <b>monitoreo de clima</b> en la <b>Play Store</b>
            </p>
          </article>
          <div className='absolute inset-0 flex justify-center items-end'>
            <img
              className='relative w-fit z-10 '
              src='/iphone.png'
              alt=""
            />
            <div className='absolute bottom-0 w-full h-1/4 bg-gradient-to-t from-black to-transparent z-20'></div>
          </div>
        </section>

        <section className='relative overflow-hidden flex flex-col row-span-2 col-span-10 lg:col-span-4 lg:row-span-6 justify-center bg-[#E2E5E7] rounded-3xl'>
          <img
            className='absolute h-full w-full top-0 left-0 object-cover lg:object-fill'
            src={dayImg}
            alt=''
          />

            <div className='relative mt-auto flex justify-between  p-3 bg-[#212126] w-full rounded-lg  '>
              <div className='flex flex-col'>
                <h2 className='text-4xl font-bold text-slate-100'>
                  {weather.name}
                </h2>
                <h4 className='text-slate-200'>{getLocalTime(weather.timezone).slice(0, 5)}</h4>
              </div>
              <div className='flex flex-col'>
                <h2 className='text-2xl text-slate-300 '>
                  {weather.main.temp.toFixed(1)}°C
                </h2>
                <h2 className='text-2xl text-slate-500 '>
                  {weather.main.feels_like.toFixed(1)}°C ST
                </h2>
              </div>
            </div>
        </section>

        <section className='col-span-10 row-span-1 lg:col-span-2 lg:row-span-1  lg:max-h-40'>
          <h2 className="flex flex-col p-4 justify-center items-center cursor-pointer transition-all bg-[#212126]/95 text-white px-6 rounded-2xl border-[#212126] border-b-[4px] hover:brightness-110 hover:-translate-y-[1px] hover:border-b-[6px] active:border-b-[2px] active:brightness-90 active:translate-y-[2px]">
            <img
              className='size-20'
              src='/copy.svg'
              alt=''
            />
            <a 
              href=" " 
              onClick={handleCopyCoordinates} 
              className="text-lg mt-3 text-center"
            >
              Copiar coordenadas
            </a>
          </h2>
        </section>

        <section className=' rounded-3xl col-span-10 row-span-1  lg:col-span-4 lg:row-span-2'>
         <MapComponent lat={lat} lon={lon} cityName={cityName} />
        </section>

        <section className='flex relative flex-col col-span-10 lg:row-span-3 lg:col-span-2 h-full justify-start items-center bg-[#F8F8F9]/60 p-6 rounded-2xl bg-gradient-to-tl from-transparent to-[#F8F8F9] '>
          <h1 className='text-center text-2xl uppercase'>
            Recomendación:
          </h1>
         <img
            className='size-28 m-5 justify-center'
            src={clothReco}
            alt='' 
         />
        </section>

        <footer className=' col-span-10 row-span-3 h-fit bg-[#212126] rounded-2xl overflow-hidden'>
          <div className='lg:flex lg:justify-between lg:px-10 bg-[#474751]'>
            <h1 className='text-center lg:text-left font-bold text-5xl text-white p-2 py-14 lg:py-2'>
              Clima<span className='text-red-800'>HOY</span>
            </h1>
            <nav className='grid grid-cols-2 lg:grid-cols-4 my-2 lg:px-6 justify-center items-center px-2'>
              <button class="flex size-14 mx-left lg:size-10 lg:mx-2 rounded-full border-0 cursor-pointer transition-transform duration-300 ease hover:scale-130 ">
                <img
                  src='/icons/face.svg'
                  alt=''
                />
                <h2 className='text-xl lg:hidden font-semibold text-white my-auto'>Facebook</h2>

              </button>
              <button class="flex size-14 mx-left lg:size-10 lg:mx-2 rounded-full border-0 cursor-pointer transition-transform duration-300 ease hover:scale-130 ">
                <img
                  src='/icons/insta.svg'
                  alt=''
                />
                <h2 className='text-xl lg:hidden font-semibold text-white my-auto'>Instagram</h2>

              </button>
              <button class="flex size-14 mx-left lg:size-10 lg:mx-2 rounded-full border-0 cursor-pointer transition-transform duration-300 ease hover:scale-130 ">
                <img
                  src='/icons/tw.svg'
                  alt=''
                />
                <h2 className='text-xl lg:hidden font-semibold text-white my-auto'>Twitter/X</h2>

              </button>
              <button class="flex size-14 mx-left lg:size-10 lg:mx-2 rounded-full border-0 cursor-pointer transition-transform duration-300 ease hover:scale-130 ">
                <img
                  src='/icons/you.svg'
                  alt=''
                />
                <h2 className='text-xl lg:hidden font-semibold text-white my-auto'>YouTube</h2>

              </button>
            </nav>
          </div>
          <div className='grid grid-cols-2 gap-y-20 lg:flex justify-center lg:justify-around lg:max-w-screen text-slate-300 lg:px-14 lg:h-fit py-20 lg:py-7'>
              <h2 className='flex justify-center items-center'>
                  <span className='font-bold px-4 lg:px-0'>Legal</span>
                  <article className='flex flex-col px-6 '>
                    <h3>
                      Politica de privacidad
                    </h3>
                    <h3>
                      Terminos y condiciones
                    </h3>
                  </article>
              </h2>
              <h2 className='flex justify-center items-center lg:border-r-2 lg:border-l-2 lg:px-20'>
                  <span className='font-bold'>Legal</span>
                  <article className='flex flex-col px-6 '>
                    <h3>
                      Politica de privacidad
                    </h3>
                    <h3>
                      Terminos y condiciones
                    </h3>
                  </article>
              </h2>
              <h2 className='flex col-span-2 justify-center items-center '>
                  <span className='font-bold px-4 lg:px-0'>Legal</span>
                  <article className='flex flex-col px-6 '>
                    <h3>
                      Politica de privacidad
                    </h3>
                    <h3>
                      Terminos y condiciones
                    </h3>
                  </article>
              </h2>
          </div>
        </footer>
      </div>
      )}
    </div>
  );
}

export default App;
