import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const services = ['Sports', 'Drama', 'Festivals', 'Comedy', 'Music']

function Navbar() {
  const navigate = useNavigate()
  const [activeService, setActiveService] = useState('Sports')
  const [currentLocation, setCurrentLocation] = useState('Locating...')
  const [currentAddress, setCurrentAddress] = useState('Fetching address...')
  const [locationStatus, setLocationStatus] = useState('loading')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const isLoggedIn = Boolean(localStorage.getItem('access'))
  const loggedInUsername = localStorage.getItem('username') || 'User'

  const fetchAddress = async (latitude, longitude) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    )

    if (!response.ok) {
      throw new Error('Address lookup failed')
    }

    const data = await response.json()
    return data.display_name || 'Address unavailable'
  }

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation('Location Unsupported')
      setLocationStatus('error')
      return
    }

    setLocationStatus('loading')
    setCurrentLocation('Locating...')
    setCurrentAddress('Fetching address...')

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setCurrentLocation('Current location')

        try {
          const address = await fetchAddress(latitude, longitude)
          setCurrentAddress(address)
        } catch {
          setCurrentAddress('Address unavailable')
        }

        setLocationStatus('success')
      },
      () => {
        setCurrentLocation('Location Denied')
        setCurrentAddress('Enable location permission to see address')
        setLocationStatus('error')
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    )
  }

  useEffect(() => {
    detectCurrentLocation()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('username')
    navigate('/login')
    setIsMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="navbar-top">
        <div className="brand">
          <span className="brand-mark">ST</span>
          <div>
            <p className="brand-title">Smart Ticket</p>
            <p className="brand-subtitle">Booking System</p>
          </div>
        </div>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-utilities ${isMenuOpen ? 'open' : ''}`}>
          <div className="city-picker">
            <svg className="city-pin-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#d61f3c"/>
            </svg>
            <div className="city-picker-text">
              <span className="city-picker-label">Location</span>
              <span className="city-picker-value">{currentLocation}</span>
              <span className="city-picker-address" title={currentAddress}>{currentAddress}</span>
            </div>
            <button
              type="button"
              className="city-refresh"
              onClick={detectCurrentLocation}
              disabled={locationStatus === 'loading'}
              aria-label="Refresh current location"
            >
              {locationStatus === 'loading' ? '...' : '↻'}
            </button>
          </div>

          <div className="search-wrap">
            <input
              type="search"
              placeholder="Search routes, operators or destinations"
              aria-label="Search routes, operators or destinations"
            />
          </div>

          <div className="nav-actions">
            {isLoggedIn ? (
              <>
                <span className="nav-user" title={loggedInUsername}>Hi, {loggedInUsername}</span>
                <button className="btn btn-light" type="button" onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}>Dashboard</button>
                <button className="btn btn-strong" type="button" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <button className="btn btn-light" type="button" onClick={() => navigate('/login')}>Sign in</button>
            )}
            <button className="btn btn-strong" type="button">Book Ticket</button>
          </div>
        </div>
      </div>

      <div className={`navbar-bottom ${isMenuOpen ? 'open' : ''}`}>
        <nav className="service-tabs" aria-label="Service categories">
          {services.map((service) => (
            <button
              key={service}
              type="button"
              className={activeService === service ? 'service-tab active' : 'service-tab'}
              onClick={() => setActiveService(service)}
            >
              {service}
            </button>
          ))}
        </nav>

        <nav className="nav-links" aria-label="Primary navigation">
          <a onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</a>
          <a onClick={() => { navigate('/offers'); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>Offers</a>
          {isLoggedIn && (
            <a onClick={() => { navigate('/history'); setIsMenuOpen(false); }} style={{ cursor: 'pointer' }}>History</a>
          )}
          <a href="#">Help</a>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
