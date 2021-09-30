import React, {useRef, useState, useEffect} from "react";
import {Form, Button, Card, Container, Dropdown} from 'react-bootstrap';
import axios from 'axios';
import $ from 'jquery'
import './Home.css';
import moment from 'moment';
require('dotenv').config();

export default function Home() {

  // Use Ref
  const amountRef = useRef();

  // Use State
  const [sport, setSport] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(-1);
  const [bookArray, setBookArray] = useState([]);
  const [gameArrayDropdown, setGameArrayDropdown] = useState([]);
  const [game, setGame] = useState("");
  const [book, setBook] = useState({index:0, title: "Book"});
  const [gameItem, setGameItem] = useState({index:-1, title: "Game"});
  const [namesList, setNamesList] = useState({});
  const [market, setMarket] = useState("");
  const [outcome, setOutcome] = useState("");
  const [moneyline, setMoneyline] = useState("");
  const [spread, setSpread] = useState("");
  const [totals, setTotals] = useState("");
  const [amount, setAmount] = useState("");

  var baseUrl = "https://api.the-odds-api.com";

  var marketArray = [];

  const NFL_Teams = {"Arizona Cardinals":"ARI", "Atlanta Falcons":"ATL", "Baltimore Ravens":"BAL",
                    "Buffalo Bills":"BUF", "Carolina Panthers":"CAR", "Dallas Cowboys":"DAL",
                    "Cincinnati Bengals":"CIN", "Cleveland Browns":"CLE", "Chicago Bears":"CHI",
                    "Denver Broncos":"DEN", "Detroit Lions":"DET", "Green Bay Packers":"GB",
                    "Houston Texans":"HOU", "Indianapolis Colts":"IND", "Jacksonville Jaguars":"JAX",
                    "Kansas City Chiefs":"KC", "Miami Dolphins":"MIA", "Minnesota Vikings":"MIN",
                    "New England Patriots":"NE", "New Orleans Saints":"NO", "New York Giants":"NYG",
                    "New York Jets": "NYJ", "Las Vegas Raiders":"LV", "Philadelphia Eagles":"PHI",
                    "Pittsburgh Steelers":"PIT", "Los Angeles Chargers":"LAC", "San Francisco 49ers":"SF",
                    "Seattle Seahawks":"SEA", "Los Angeles Rams":"LAR", "Tampa Bay Buccaneers":"TB",
                    "Tennessee Titans":"TEN", "Washington Football Team":"WAS"
                    };
  
  const MLB_Teams = {"Arizona Diamondbacks": "ARI",	"Atlanta Braves":	"ATL", "Baltimore Orioles": "BAL",
                    "Boston Red Sox":	"BOS", "Chicago White Sox": "CWS", "Chicago Cubs":	"CHC",
                    "Cincinnati Reds":	"CIN", "Cleveland Indians": "CLE", "Colorado Rockies":	"COL",
                    "Detroit Tigers":	"DET", "Houston Astros":	"HOU", "Kansas City Royals":	"KC",
                    "Los Angeles Angels":	"ANA", "Los Angeles Dodgers": "LAD", "Miami Marlins": "MIA",
                    "Milwaukee Brewers": "MIL", "Minnesota Twins": "MIN", "New York Mets": "NYM",
                    "New York Yankees":	"NYY", "Oakland Athletics": "OAK", "Philadelphia Phillies": "PHI",	
                    "Pittsburgh Pirates":	"PIT", "San Diego Padres":	"SD", "San Francisco Giants":	"SF",
                    "Seattle Mariners":	"SEA", "St. Louis Cardinals": "STL", "Tampa Bay Rays":	"TB",
                    "Texas Rangers": "TEX", "Toronto Blue Jays": "TOR", "Washington Nationals":	"WAS"
                    }

  const NBA_Teams = {"Boston Celtics": "BOS", "Brooklyn Nets": "BKN", "New York Knicks": "NY",
                    "Philadelphia 76ers": "PHI", "Toronto Raptors": "TOR", "Golden State Warriors": "GS",    
                    "Los Angeles Clippers": "LAC", "Los Angeles Lakers": "LAL", "Phoenix Suns": "PHX",
                    "Sacramento Kings": "SAC", "Chicago Bulls": "CHI", "Cleveland Cavaliers": "CLE",
                    "Detroit Pistons": "DET", "Indiana Pacers": "IND", "Milwaukee Bucks": "MIL",
                    "Dallas Mavericks": "DAL", "Houston Rockets": "HOU", "Memphis Grizzlies": "MEM",
                    "New Orleans Pelicans": "NO", "San Antonio Spurs": "SA", "Atlanta Hawks": "ATL",
                    "Charlotte Hornets": "CHA", "Miami Heat": "MIA", "Orlando Magic": "ORL",
                    "Washington Wizards": "WSH", "Denver Nuggets": "DEN", "Minnesota Timberwolves": "MIN",
                    "Oklahoma City Thunder": "OKC", "Portland Trail Blazers": "POR", "Utah Jazz": "UTA"
                  }
          
  const Market_Names = {"h2h": "Moneyline", "spreads": "Spread", "totals": "Total"};

  const Sport_Names = {"americanfootball_nfl": "Football - NFL", "baseball_mlb": "Baseball - MLB", "basketball_nba": "Basketball - NBA"}

  function buildSlotItem (text) {
    return $('<div>').addClass('slottt-machine-recipe__item')
                     .text(text);
}

function buildSlotContents ($container, gameArray) {
  var $items = gameArray.map(buildSlotItem);
  $container.append($items);
}

function popPushNItems ($container, n) {
    var $children = $container.find('.slottt-machine-recipe__item');
    $children.slice(0, n).insertAfter($children.last());

    if (n === $children.length) {
      popPushNItems($container, 1);
    }
}

// After the slide animation is complete, we want to pop some items off
// the front of the container and push them onto the end. This is
// so the animation can slide upward infinitely without adding
// inifinte div elements inside the container.
function rotateContents ($container, n) {
    setTimeout(function () {
      popPushNItems($container, n);
      $container.css({top: 0});
    }, 300);   
}
  
function animate(randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container');
  var wordIndex = randNum;
  $wordbox.animate({top: -wordIndex*150}, 500, 'swing', function () {
    rotateContents($wordbox, wordIndex);
  });
}

function spin(itemArray, randNum) {
  var $wordbox = $('#wordbox .slottt-machine-recipe__items_container');
  buildSlotContents($wordbox, itemArray);
  
  setInterval(animate(randNum), 2000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
}

function removeElementsByClass(className){
  const elements = document.getElementsByClassName(className);
  while(elements.length > 0){
      elements[0].parentNode.removeChild(elements[0]);
  }
}

function getMarkets() {
  if (moneyline !== "") {
    marketArray.push(moneyline);
  }
  if (spread !== "") {
    marketArray.push(spread);
  }
  if (totals !== "") {
    marketArray.push(totals);
  }
  if (moneyline === "" && spread === "" && totals === "") {
    marketArray = ["h2h,spreads,totals"];
  }
  return marketArray;
}

  async function handleSubmit(e) {
      e.preventDefault();

      console.log(marketArray);

      var game_randNum;
      var market_randNum;
      var outcome_randNum;

      if (error === "") {
        if (document.getElementsByClassName('slottt-machine-recipe__item').length !== 0) {
          removeElementsByClass('slottt-machine-recipe__item');
        }
        setLoading(1);
        setAmount(amountRef.current.value);
        axios({
          method: 'get',
          url: baseUrl + `/v4/sports/${sport}/odds/?apiKey=${process.env.REACT_APP_ODDS_API_KEY}&regions=us&markets=${getMarkets().toString()}&oddsFormat=american`,
        })
        .then(res => {
            console.log(res.data);
            game_randNum = (Math.floor(Math.random() * res.data.length));
            market_randNum = (Math.floor(Math.random() * res.data[game_randNum].bookmakers[book.index].markets.length));
            outcome_randNum = (Math.floor(Math.random() * res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes.length));
            setLoading(0);

            var gameArray = res.data.map(function(game) {
              return `${game.away_team} at ${game.home_team}`;
            });

            var marketArray = res.data[game_randNum].bookmakers[book.index].markets.map(function(market) {
              return `${market.key}`;
            });

            var outcomeArray = res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes.map(function(outcome) {
              return `${outcome.name}`;
            });

            // spin(marketArray, market_randNum);
            // spin(outcomeArray, outcome_randNum);
            if (gameItem.index === -1){
              setGame(res.data[game_randNum]);
              spin(gameArray, game_randNum);
              setMarket(res.data[game_randNum].bookmakers[book.index].markets[market_randNum]);
              setOutcome(res.data[game_randNum].bookmakers[book.index].markets[market_randNum].outcomes[outcome_randNum]);
            } else {
              setGame(res.data[gameItem.index]);
              spin(gameArray, gameItem.index);
              setMarket(res.data[gameItem.index].bookmakers[book.index].markets[market_randNum]);
              setOutcome(res.data[gameItem.index].bookmakers[book.index].markets[market_randNum].outcomes[outcome_randNum]);
            }
        })
        .catch(function() {
          setError("Unable to generate bet");
        });

        // Reset state after submit
        $('input[type=checkbox]').prop('checked',false);
        setBook({index:0, title: "Book"});
        setGameItem({index:-1, title: "Game"});
        setMoneyline("");
        setSpread("");
        setTotals("");

        // reset fields
        e.target.reset();
      }
    }

  const handleChange = e => {
    var sport_radio = e.target.value;
    setSport(e.target.value);
    if (e.target.value === "americanfootball_nfl") {
      setNamesList(NFL_Teams);
    } else if (e.target.value === "baseball_mlb") {
      setNamesList(MLB_Teams);
    } else if (e.target.value === "basketball_nba") {
      setNamesList(NBA_Teams);
    }
    axios({
      method: 'get',
      url: baseUrl + `/v4/sports/${sport_radio}/odds?regions=us&oddsFormat=american&apiKey=${process.env.REACT_APP_ODDS_API_KEY}`,
    })
    .then(res => {
      setBookArray(res.data[0].bookmakers);
      setGameArrayDropdown(res.data);
    }).catch(function() {
      setError("Unable to generate books");
    });
  };

  const handleMLSelect = e => {  
      if ($('#moneyline').is(":checked")) {
        setMoneyline(e.target.value);
      } else {
        setMoneyline("");
      }   
  };

  const handleSpreadSelect = e => {
    if ($('#spread').is(":checked")) {
        setSpread(e.target.value);
        console.log("spread");
      } else {
        setSpread("");
      } 
    
  };

  const handleTotalSelect = e => {
    if ($('#totals').is(":checked")) {
        setTotals(e.target.value);
        console.log("totals")
      } else {
        setTotals("");
      } 
  };

  const borderStyles = {
    borderRadius: "10px",
    boxShadow: "0 2px 20px rgba(0, 0, 0, 0.2)"
  }

  return (
    <>
    <Container
            className="d-flex justify-content-center container"
            style={{ minHeight: "100vh", paddingTop: "30px"}}
        >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          { success && 
          <div className="alert alert-success">{success}</div> }
          { error && 
          <div className="alert alert-danger">{error}</div> }
            <div style={ borderStyles }>
                <Card.Body>
                    <h2 className="text-center heading">Sports Bet Roulette</h2>
                    <div className="text-center mb-4 subheading">Randomly Generate a Bet</div>
                    <hr/>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group id="amount" className="input-icon">
                            <Form.Label>Amount</Form.Label>
                            <i>$</i>
                            <Form.Control type="number" min="1" step="any" placeholder="0.00" ref={amountRef} required/>
                        </Form.Group>
                        <div className="row">
                          <div className="col">
                            <Form.Group id="type">
                            <Form.Label>Sport</Form.Label>
                              <Form.Check 
                                type={'radio'}
                                id={'Football'}
                                value={'americanfootball_nfl'}
                                label={'Football'}
                                name={'sport'}
                                className="checkbox"
                                onChange={handleChange}
                                required
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Basketball'}
                                value={'basketball_nba'}
                                label={'Basketball'}
                                name={'sport'}
                                className="checkbox"
                                onChange={handleChange}
                                required
                              />
                              <Form.Check 
                                type={'radio'}
                                id={'Baseball'}
                                value={'baseball_mlb'}
                                label={'Baseball'}
                                name={'sport'}
                                className="checkbox"
                                onChange={handleChange}
                                required
                              />
                          </Form.Group>
                          </div>
                          <div className="col">
                            <Form.Group>
                              <Form.Label>Bets</Form.Label>
                                <Form.Check 
                                  id={'moneyline'}
                                  value={'h2h'}
                                  label={'Moneyline'}
                                  name={'moneyline'}
                                  className="checkbox"
                                  onChange={handleMLSelect}
                                />
                                <Form.Check 
                                  id={'spread'}
                                  value={'spreads'}
                                  label={'Spread'}
                                  name={'spreads'}
                                  className="checkbox"
                                  onChange={handleSpreadSelect}
                                />
                                <Form.Check 
                                  id={'totals'}
                                  value={'totals'}
                                  label={'Totals'}
                                  name={'totals'}
                                  className="checkbox"
                                  onChange={handleTotalSelect}
                                />
                            </Form.Group>
                          </div>
                        </div>
                        <div className="row">
                          {/* **************************** TEAM DROPDOWN *************************** */}
                          <div className="col">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic" className="button btn-danger" style={{marginBottom: "20px"}}>
                                {gameItem.title}
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{overflow: "auto", maxHeight: "200px"}}>
                              <Dropdown.Item onClick={() => {setGameItem({index: -1, title: "Any"})}}>Any</Dropdown.Item>
                                {gameArrayDropdown.map(gameEntry =>
                                    <Dropdown.Item onClick={() => {setGameItem({index: gameArrayDropdown.indexOf(gameEntry), title: `${namesList[gameEntry.away_team]} @ ${namesList[gameEntry.home_team]}`})}}>{`${namesList[gameEntry.away_team]} @ ${namesList[gameEntry.home_team]}`}</Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown> 
                          </div>

                          {/* **************************** BOOK DROPDOWN *************************** */}
                          <div className="col">
                            <Dropdown>
                              <Dropdown.Toggle id="dropdown-basic" className="button btn-danger" style={{marginBottom: "20px"}}>
                                {book.title}
                              </Dropdown.Toggle>
                              <Dropdown.Menu style={{overflow: "auto", maxHeight: "200px"}}>
                              <Dropdown.Item onClick={() => {setBook({index: 0, title: "Any"})}}>Any</Dropdown.Item>
                                {bookArray.map(bookName =>
                                  <Dropdown.Item key={bookName.key} onClick={() => {setBook({index: bookArray.indexOf(bookName), title: bookName.title})}}>{bookName.title}</Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        </div>
                        <Button className="w-100 button" type="submit">Bet!</Button>
                    </Form>
                </Card.Body>
            </div>
            {loading===1 && 
            <div>
              <div>Generating Bet...</div>
            </div>}
            {loading===0 && 
            <div className="bet-container">
              <div>
                <div>
                  <div>Risk ${parseFloat(amount).toFixed(2)} / To Win ${outcome.price > 0 ? (outcome.price/100 * amount).toFixed(2) : ((100/Math.abs(outcome.price)) * amount).toFixed(2)} / Odds {outcome.price > 0 ? `+${outcome.price}` : outcome.price} </div>
                </div>
                <ul>
                  <li>
                    <div>
                      <div>
                        <hr/>
                        <span className="market">{Market_Names[market.key]} - </span>
                        <span className="market">{outcome.name} {(market.key === "spreads" && outcome.point > 0) ?  `+${outcome.point}` : outcome.point} ({outcome.price > 0 ? `+${outcome.price}` : outcome.price})</span>
                        <div>{moment(game.commence_time).format("M/D/YY")}</div>
                        <hr/>
                      </div>
                      <div>
                        <span> </span>
                        <div>{game.away_team} @ {game.home_team} </div>
                        <span>{Sport_Names[sport]}</span> 
                        <div>{moment(game.commence_time).format("MMM Do YYYY h:mm a")}</div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            }
            <div className="slottt-machine-recipe">
              <div className="slottt-machine-recipe__mask" id="wordbox">
                <div className="slottt-machine-recipe__items_container recipe_if" id="slot_items_list"></div>
              </div>
            </div>
            {/* <div className="slottt-machine-recipe">
              <div className="slottt-machine-recipe__mask" id="wordbox">
                <div className="slottt-machine-recipe__items_container recipe_if" id="slot_items_list"></div>
              </div>
            </div> */}
    </div>
    </Container>
    </>
  )
}