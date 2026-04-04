import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Events.css";

export default function Events() {
  const navigate = useNavigate();

  const [selectedCity, setSelectedCity] = useState("All");
  const [sortBy, setSortBy] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState(5000);
  const [favorites, setFavorites] = useState([]);

  const cities = ["All", "Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune", "Goa"];

  const movies = [
    { id: 0, name: "Dhurandhar", city: "Mumbai", price: 360, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80" },
    { id: 1, name: "KGF Chapter 2", city: "Bangalore", price: 300, image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=500&q=80" },
    { id: 2, name: "RRR", city: "Hyderabad", price: 250, image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=500&q=80" },
    { id: 3, name: "Kantara", city: "Bangalore", price: 220, image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=500&q=80" },
    { id: 4, name: "Jawan", city: "Mumbai", price: 350, image: "https://images.unsplash.com/photo-1595769816263-9b910be24d5f?auto=format&fit=crop&w=500&q=80" },
    { id: 5, name: "Pathaan", city: "Delhi", price: 320, image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=500&q=80" },
    { id: 6, name: "Leo", city: "Chennai", price: 280, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80" },
    { id: 7, name: "Salaar", city: "Hyderabad", price: 300, image: "https://images.unsplash.com/photo-1581905764498-f1b60bae941a?auto=format&fit=crop&w=500&q=80" },
    { id: 8, name: "Animal", city: "Mumbai", price: 340, image: "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=500&q=80" },
  ];

  const upcomingMovies = [
    { id: 21, name: "Pushpa 2", city: "All", price: 350, image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=500&q=80" },
    { id: 22, name: "Dunki", city: "All", price: 300, image: "https://images.unsplash.com/photo-1574267432553-4b4628081c31?auto=format&fit=crop&w=500&q=80" },
    { id: 23, name: "Game Changer", city: "All", price: 330, image: "https://images.unsplash.com/photo-1585951237318-9ea5e175b891?auto=format&fit=crop&w=500&q=80" },
  ];

  const events = [
    { id: 101, name: "Arijit Singh Live", city: "Bangalore", price: 1500, image: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2" },
    { id: 102, name: "Standup Comedy Night", city: "Pune", price: 800, image: "https://images.unsplash.com/photo-1521336575822-6da63fb45455" },
    { id: 103, name: "Tech Conference 2026", city: "Hyderabad", price: 1200, image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df" },
    { id: 104, name: "EDM Festival Goa", city: "Goa", price: 2500, image: "https://images.unsplash.com/photo-1506157786151-b8491531f063" },
    { id: 105, name: "Coldplay Concert", city: "Mumbai", price: 5000, image: "https://images.unsplash.com/photo-1497032205916-ac775f0649ae" },
  ];

  const upcomingEvents = [
    { id: 201, name: "Sunburn Festival 2026", city: "Goa", price: 3500, image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745" },
    { id: 202, name: "Startup Summit India", city: "Bangalore", price: 1800, image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678" },
    { id: 203, name: "Comedy Fest", city: "Mumbai", price: 900, image: "https://images.unsplash.com/photo-1515165562835-c4c6c1f2a03c" },
  ];

  const allItems = useMemo(
    () => [...movies, ...upcomingMovies, ...events, ...upcomingEvents],
    []
  );

  const filteredCount = useMemo(() => {
    return allItems.filter((item) => {
      const cityMatch =
        selectedCity === "All" ||
        item.city?.toLowerCase() === selectedCity.toLowerCase() ||
        item.city === "All";
      const priceMatch = item.price <= maxPrice;
      return cityMatch && priceMatch;
    }).length;
  }, [allItems, maxPrice, selectedCity]);

  const applyFiltersAndSort = (data) => {
    const filtered = data.filter((item) => {
      const cityMatch =
        selectedCity === "All" ||
        item.city?.toLowerCase() === selectedCity.toLowerCase() ||
        item.city === "All";
      const priceMatch = item.price <= maxPrice;
      return cityMatch && priceMatch;
    });

    if (sortBy === "priceLow") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sortBy === "priceHigh") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    if (sortBy === "name") {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const getRating = (id) => (8 + (id % 20) / 10).toFixed(1);

  const renderRow = (title, subtitle, data) => {
    const rows = applyFiltersAndSort(data);

    return (
      <section className="events-section" aria-label={title}>
        <div className="events-section__head">
          <div>
            <h2 className="events-section-title">{title}</h2>
            <p className="events-section-sub">{subtitle}</p>
          </div>
          <span className="events-count-pill">{rows.length} results</span>
        </div>

        {rows.length === 0 ? (
          <div className="events-empty">
            <p>No matches for current filters in this section.</p>
          </div>
        ) : (
          <div className="events-row">
            {rows.map((item) => {
              const isFav = favorites.includes(item.id);

              return (
                <article
                  key={item.id}
                  className="events-card"
                  onClick={() => navigate(`/event/${item.id}`, { state: item })}
                >
                  <div className="events-card__media">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="events-card__poster"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "https://picsum.photos/seed/ticketx-fallback/400/600";
                      }}
                    />
                    <span className="events-card__rating">{getRating(item.id)} IMDb</span>
                    <button
                      type="button"
                      className={`events-card__fav${isFav ? " events-card__fav--active" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      aria-label={isFav ? "Remove favorite" : "Add favorite"}
                    >
                      {isFav ? "❤" : "♡"}
                    </button>
                  </div>
                  <h4 className="events-card__name">{item.name}</h4>
                  <p className="events-card__city">{item.city}</p>
                  <div className="events-card__foot">
                    <p className="events-card__price">Rs. {item.price}</p>
                    <span className="events-card__cta">Book</span>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    );
  };

  return (
    <div className="events-page">
      <header className="events-hero">
        <h1 className="events-hero__title">Discover Events and Movies</h1>
        <p className="events-hero__sub">Filter by city, refine by budget, and book in seconds.</p>
      </header>

      <section className="events-toolbar" aria-label="Filters and sorting">
        <div className="events-toolbar__group">
          <label htmlFor="sortBy">Sort</label>
          <select
            id="sortBy"
            className="events-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Recommended</option>
            <option value="priceLow">Price: Low to High</option>
            <option value="priceHigh">Price: High to Low</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>

        <div className="events-toolbar__group events-toolbar__group--range">
          <label htmlFor="maxPrice">Max Price: Rs. {maxPrice}</label>
          <input
            id="maxPrice"
            type="range"
            min="200"
            max="5000"
            step="100"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <div className="events-toolbar__summary">
          Showing <strong>{filteredCount}</strong> items
        </div>
      </section>

      <div className="events-chips">
        {cities.map((c) => (
          <button
            key={c}
            type="button"
            className={`events-chip${selectedCity === c ? " events-chip--active" : ""}`}
            onClick={() => setSelectedCity(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {renderRow("Now Showing", "Current theatrical releases", movies)}
      {renderRow("Upcoming Movies", "Advance booking now open", upcomingMovies)}
      {renderRow("Live Events", "Concerts, comedy and tech gatherings", events)}
      {renderRow("Upcoming Events", "Plan your next outing ahead", upcomingEvents)}
    </div>
  );
}
