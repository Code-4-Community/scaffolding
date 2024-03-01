import { useState } from 'react';
import './FlippableTIle.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FlipCard({ ...props }) {
  const card = props.card;
  const redLine = (
    <svg
      width="139"
      height="4"
      viewBox="0 0 139 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line y1="2" x2="139.004" y2="2" stroke="#FB4D42" stroke-width="4" />
    </svg>
  );

  const [showBack, setShowBack] = useState(false);

  function handleMouseEnter() {
    setShowBack(true);
  }

  function handleMouseLeave() {
    setShowBack(false);
  }

  return (
    <div
      className="flip-card-outer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`flip-card-inner ${showBack ? 'showBack' : ''}`}>
        <div className="card front">
          <div className="icon-placeholder col-md-4">
            {card.icon('#091F2F')}
          </div>
          <p className="card-text text-center ">{card.front}</p>
          <p>{redLine}</p>
        </div>
        <div
          className="card back"
          style={{ backgroundImage: `url(${card.background})` }}
        >
          <div className="icon-placeholder col-md-4">
            {card.icon('#FFFDFD')}
          </div>
          <p className="card-text text-center">{card.back}</p>
          <p>{redLine}</p>
        </div>
      </div>
    </div>
  );
}
